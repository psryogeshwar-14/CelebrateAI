# ============================================================================
# CelebrateAI Production Dockerfile (Google Cloud Run in asia-south1)
# Multi-stage build with Node 20 Alpine, tini init, and non-root user
# ============================================================================

# Stage 1: Dependencies
FROM node:20-alpine AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
RUN npm ci

# Stage 2: Builder
FROM node:20-alpine AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# Stage 3: Runner
FROM node:20-alpine AS runner
WORKDIR /app

# Install tini for graceful PID 1 signal forwarding (SIGTERM / SIGINT)
RUN apk add --no-cache libc6-compat tini

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=8080
ENV HOSTNAME="0.0.0.0"

# Non-root user with dedicated UID/GID
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy standalone output from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 8080

# tini guarantees clean SIGTERM propagation and graceful connection draining on Cloud Run scale-down
ENTRYPOINT ["/sbin/tini", "--"]
CMD ["node", "server.js"]

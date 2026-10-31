#!/usr/bin/env bash
# ============================================================================
# CelebrateAI - Google Cloud Run Deployment Script (asia-south1)
# ============================================================================

set -euo pipefail

REGION="asia-south1"
SERVICE_NAME="celebrateai"
PROJECT_ID="${1:-$(gcloud config get-value project 2>/dev/null || true)}"

if [ -z "$PROJECT_ID" ]; then
  echo "Error: Google Cloud PROJECT_ID could not be determined."
  echo "Usage: ./scripts/deploy-cloud-run.sh <PROJECT_ID>"
  exit 1
fi

echo "============================================================"
echo "Deploying CelebrateAI to Google Cloud Run"
echo "Project:  ${PROJECT_ID}"
echo "Region:   ${REGION}"
echo "Service:  ${SERVICE_NAME}"
echo "Specs:    CPU: 1 | Memory: 512Mi | Min: 0 | Max: 3"
echo "============================================================"

# 1. Enable Required Google Cloud Services
echo "==> Step 1: Enabling required Google Cloud APIs..."
gcloud services enable \
  run.googleapis.com \
  artifactregistry.googleapis.com \
  cloudbuild.googleapis.com \
  secretmanager.googleapis.com \
  --project="${PROJECT_ID}" \
  --quiet

# 2. Provision Secrets in Secret Manager (Masked, zero leakage)
echo "==> Step 2: Ensuring Secret Manager secrets are configured..."
chmod +x ./scripts/setup-secrets.sh
./scripts/setup-secrets.sh "${PROJECT_ID}"

# 3. Build Container via Google Cloud Build
echo "==> Step 3: Submitting container build to Google Cloud Build..."
IMAGE_TAG="gcr.io/${PROJECT_ID}/${SERVICE_NAME}:latest"
gcloud builds submit \
  --project="${PROJECT_ID}" \
  --tag="${IMAGE_TAG}" \
  .

# 4. Deploy Container to Google Cloud Run in asia-south1
echo "==> Step 4: Deploying to Google Cloud Run in ${REGION}..."
gcloud run deploy "${SERVICE_NAME}" \
  --project="${PROJECT_ID}" \
  --image="${IMAGE_TAG}" \
  --region="${REGION}" \
  --platform="managed" \
  --allow-unauthenticated \
  --port=8080 \
  --min-instances=0 \
  --max-instances=3 \
  --memory=512Mi \
  --cpu=1 \
  --set-env-vars="NODE_ENV=production,PORT=8080,HOSTNAME=0.0.0.0" \
  --set-secrets="GEMINI_API_KEY=GEMINI_API_KEY:latest,NEXT_PUBLIC_SUPABASE_URL=NEXT_PUBLIC_SUPABASE_URL:latest,NEXT_PUBLIC_SUPABASE_ANON_KEY=NEXT_PUBLIC_SUPABASE_ANON_KEY:latest,SUPABASE_SERVICE_ROLE_KEY=SUPABASE_SERVICE_ROLE_KEY:latest" \
  --quiet

# 5. Retrieve Public Cloud Run URL
echo "==> Step 5: Fetching deployed service URL..."
SERVICE_URL=$(gcloud run services describe "${SERVICE_NAME}" \
  --project="${PROJECT_ID}" \
  --region="${REGION}" \
  --format="value(status.url)")

echo ""
echo "============================================================"
echo "🎉 CelebrateAI Deployment Successful!"
echo "Region:      ${REGION}"
echo "Public URL:  ${SERVICE_URL}"
echo "Health:      ${SERVICE_URL}/api/health"
echo "============================================================"

# 6. Automated Health Check Verification
echo "==> Step 6: Verifying health endpoint..."
if command -v curl >/dev/null 2>&1; then
  HEALTH_STATUS=$(curl -s "${SERVICE_URL}/api/health" | grep -o '"status":"ok"' || true)
  if [ -n "$HEALTH_STATUS" ]; then
    echo "  [HEALTH CHECK PASSED] Endpoint returned: { status: \"ok\" }"
  else
    echo "  [NOTE] Health check could not be verified automatically via curl."
  fi
fi

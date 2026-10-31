#!/usr/bin/env bash
# ============================================================================
# CelebrateAI - Secret Manager Provisioning Script
# Securely provisions secrets in Google Secret Manager without printing secrets in logs
# ============================================================================

set -euo pipefail

PROJECT_ID="${1:-$(gcloud config get-value project 2>/dev/null || true)}"

if [ -z "$PROJECT_ID" ]; then
  echo "Error: Google Cloud PROJECT_ID not found."
  echo "Usage: ./scripts/setup-secrets.sh <PROJECT_ID>"
  exit 1
fi

echo "==> Configuring Google Secret Manager for project: ${PROJECT_ID}..."

# Enable Secret Manager API
gcloud services enable secretmanager.googleapis.com --project="${PROJECT_ID}" --quiet

# Helper function to create or update secret securely from stdin
create_or_update_secret() {
  local secret_name="$1"
  local secret_val="$2"

  if [ -z "$secret_val" ]; then
    echo "  [SKIPPED] ${secret_name} (value is empty or not provided)"
    return 0
  fi

  # Check if secret exists
  if gcloud secrets describe "${secret_name}" --project="${PROJECT_ID}" >/dev/null 2>&1; then
    echo "  [UPDATING] Adding new version for secret: ${secret_name} (masked)"
    printf "%s" "${secret_val}" | gcloud secrets versions add "${secret_name}" \
      --project="${PROJECT_ID}" \
      --data-file=- \
      --quiet >/dev/null
  else
    echo "  [CREATING] Creating secret: ${secret_name} (masked)"
    printf "%s" "${secret_val}" | gcloud secrets create "${secret_name}" \
      --project="${PROJECT_ID}" \
      --replication-policy="automatic" \
      --data-file=- \
      --quiet >/dev/null
  fi
}

# If .env.local exists, source secrets safely without printing
if [ -f .env.local ]; then
  echo "==> Loading secret values from .env.local (values will NOT be printed)..."
  # Read variables while trimming quotes
  GEMINI_KEY=$(grep -E '^GEMINI_API_KEY=' .env.local | cut -d '=' -f2- | tr -d '"' | tr -d "'" || true)
  SUPABASE_URL=$(grep -E '^NEXT_PUBLIC_SUPABASE_URL=' .env.local | cut -d '=' -f2- | tr -d '"' | tr -d "'" || true)
  SUPABASE_ANON=$(grep -E '^NEXT_PUBLIC_SUPABASE_ANON_KEY=' .env.local | cut -d '=' -f2- | tr -d '"' | tr -d "'" || true)
  SUPABASE_SERVICE=$(grep -E '^SUPABASE_SERVICE_ROLE_KEY=' .env.local | cut -d '=' -f2- | tr -d '"' | tr -d "'" || true)

  create_or_update_secret "GEMINI_API_KEY" "${GEMINI_KEY}"
  create_or_update_secret "NEXT_PUBLIC_SUPABASE_URL" "${SUPABASE_URL}"
  create_or_update_secret "NEXT_PUBLIC_SUPABASE_ANON_KEY" "${SUPABASE_ANON}"
  create_or_update_secret "SUPABASE_SERVICE_ROLE_KEY" "${SUPABASE_SERVICE}"
else
  echo "==> .env.local not found. Creating placeholder secret shells if missing..."
  create_or_update_secret "GEMINI_API_KEY" "${GEMINI_API_KEY:-placeholder-gemini-key}"
  create_or_update_secret "NEXT_PUBLIC_SUPABASE_URL" "${NEXT_PUBLIC_SUPABASE_URL:-https://placeholder.supabase.co}"
  create_or_update_secret "NEXT_PUBLIC_SUPABASE_ANON_KEY" "${NEXT_PUBLIC_SUPABASE_ANON_KEY:-placeholder-anon-key}"
  create_or_update_secret "SUPABASE_SERVICE_ROLE_KEY" "${SUPABASE_SERVICE_ROLE_KEY:-placeholder-service-key}"
fi

# Grant Cloud Run default service account permission to read secrets
PROJECT_NUMBER=$(gcloud projects describe "${PROJECT_ID}" --format="value(projectNumber)" 2>/dev/null || echo "${PROJECT_ID}")
CLOUD_RUN_SA="${PROJECT_NUMBER}-compute@developer.gserviceaccount.com"

echo "==> Granting Secret Accessor role to Cloud Run Service Account: ${CLOUD_RUN_SA}..."
for secret_name in "GEMINI_API_KEY" "NEXT_PUBLIC_SUPABASE_URL" "NEXT_PUBLIC_SUPABASE_ANON_KEY" "SUPABASE_SERVICE_ROLE_KEY"; do
  gcloud secrets add-iam-policy-binding "${secret_name}" \
    --project="${PROJECT_ID}" \
    --member="serviceAccount:${CLOUD_RUN_SA}" \
    --role="roles/secretmanager.secretAccessor" \
    --quiet >/dev/null 2>&1 || true
done

echo "==> Secret Manager provisioning complete! All secrets stored securely."

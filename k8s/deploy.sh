#!/usr/bin/env bash
# Thin wrapper — canonical deploy lives in k8s-infrastructure.
# Usage: ./k8s/deploy.sh   (or call infra script directly)
set -euo pipefail
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
INFRA_DEPLOY="$(cd "${SCRIPT_DIR}/../../k8s-infrastructure/deploy" && pwd)"
exec "${INFRA_DEPLOY}/tier6-apps/deploy-socialx.sh" "$@"

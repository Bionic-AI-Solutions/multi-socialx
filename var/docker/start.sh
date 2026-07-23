#!/usr/bin/env bash
# Container start: wait for deps, migrate schema, launch PM2 processes.
set -euo pipefail

echo "[start] Waiting for Temporal at ${TEMPORAL_ADDRESS:-socialx-temporal:7233}..."
TEMPORAL_HOST="${TEMPORAL_ADDRESS%%:*}"
TEMPORAL_PORT="${TEMPORAL_ADDRESS##*:}"
TEMPORAL_HOST="${TEMPORAL_HOST:-socialx-temporal.socialx.svc.cluster.local}"
TEMPORAL_PORT="${TEMPORAL_PORT:-7233}"
for i in $(seq 1 60); do
  if (echo >/dev/tcp/${TEMPORAL_HOST}/${TEMPORAL_PORT}) >/dev/null 2>&1; then
    echo "[start] Temporal is reachable"
    break
  fi
  # /dev/tcp may be unavailable — fall back to node
  if node -e "const n=require('net');const s=n.connect(${TEMPORAL_PORT},'${TEMPORAL_HOST}',()=>{s.end();process.exit(0)});s.on('error',()=>process.exit(1))" 2>/dev/null; then
    echo "[start] Temporal is reachable"
    break
  fi
  sleep 2
  if [[ "$i" -eq 60 ]]; then
    echo "[start] WARNING: Temporal not reachable after 120s — continuing anyway"
  fi
done

echo "[start] Running prisma db push..."
cd /app
pnpm run prisma-db-push

echo "[start] Starting nginx + PM2..."
nginx
exec pm2-runtime /app/var/docker/ecosystem.config.js

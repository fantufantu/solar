#!/usr/bin/env bash

set -euo pipefail

readonly ROOT_DIR="$(cd -- "$(dirname -- "${BASH_SOURCE[0]}")/.." && pwd)"
readonly ECOSYSTEM_FILE="$ROOT_DIR/ecosystem.config.js"
readonly START_TIMEOUT_SECONDS="${PM2_START_TIMEOUT_SECONDS:-60}"

# The order reflects the runtime dependencies documented in AGENTS.md.
readonly -a SERVICES=(
  'pluto:3010'
  'mercury:3100'
  'venus:3200'
  'earth:3300'
  'mars:3400'
  'jupiter:3500'
  'halley:3900'
)

if ! [[ "$START_TIMEOUT_SECONDS" =~ ^[1-9][0-9]*$ ]]; then
  printf 'PM2_START_TIMEOUT_SECONDS must be a positive integer.\n' >&2
  exit 1
fi

for required_command in node pm2; do
  if ! command -v "$required_command" >/dev/null 2>&1; then
    printf 'Required command not found: %s\n' "$required_command" >&2
    exit 1
  fi
done

wait_for_port() {
  local service_name="$1"
  local port="$2"
  local deadline=$((SECONDS + START_TIMEOUT_SECONDS))

  while ((SECONDS < deadline)); do
    if node - "$port" <<'NODE'
const net = require('node:net');
const port = Number(process.argv[2]);
const socket = net.createConnection({ host: '127.0.0.1', port });

const finish = (exitCode) => {
  socket.destroy();
  process.exit(exitCode);
};

socket.setTimeout(1_000);
socket.once('connect', () => finish(0));
socket.once('error', () => finish(1));
socket.once('timeout', () => finish(1));
NODE
    then
      printf '%s is ready on port %s.\n' "$service_name" "$port"
      return 0
    fi

    sleep 1
  done

  printf 'Timed out waiting for %s on port %s after %s seconds.\n' \
    "$service_name" "$port" "$START_TIMEOUT_SECONDS" >&2
  pm2 logs "$service_name" --lines 50 --nostream >&2 || true
  return 1
}

cd -- "$ROOT_DIR"

for service in "${SERVICES[@]}"; do
  service_name="${service%%:*}"
  port="${service##*:}"

  printf 'Starting %s...\n' "$service_name"
  pm2 start "$ECOSYSTEM_FILE" --only "$service_name" --update-env
  wait_for_port "$service_name" "$port"
done

pm2 save

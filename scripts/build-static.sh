#!/usr/bin/env bash
set -euo pipefail
cd /workspace

export DEPLOY_STATIC=1
API_DIR="src/app/api"
API_BACKUP="src/app/_api_backup_for_static_export"

cleanup() {
  if [ -d "$API_BACKUP" ]; then
    rm -rf "$API_DIR"
    mv "$API_BACKUP" "$API_DIR"
  fi
}
trap cleanup EXIT

if [ -d "$API_DIR" ]; then
  rm -rf "$API_BACKUP"
  mv "$API_DIR" "$API_BACKUP"
fi

rm -rf out .next
npm run build
echo "Static build ready in ./out"

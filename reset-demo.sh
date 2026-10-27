#!/usr/bin/env bash
# Resets demo-project/ back to its original "dirty" state for live demos.
# Run this from inside the nukelear-main folder:
#   bash reset-demo.sh

set -e

DEMO_DIR="$(dirname "$0")/demo-project"

rm -rf "$DEMO_DIR"
mkdir -p "$DEMO_DIR/node_modules" \
         "$DEMO_DIR/dist" \
         "$DEMO_DIR/.next" \
         "$DEMO_DIR/src" \
         "$DEMO_DIR/backend/venv" \
         "$DEMO_DIR/backend/__pycache__" \
         "$DEMO_DIR/.vscode"

touch "$DEMO_DIR/.DS_Store"
echo "console.log('hello world');" > "$DEMO_DIR/src/app.js"
echo "def main(): pass" > "$DEMO_DIR/backend/main.py"

# macOS (BSD) dd uses lowercase 1m; Linux (GNU) dd needs uppercase 1M.
if dd if=/dev/zero of=/dev/null bs=1m count=1 >/dev/null 2>&1; then
  BS="1m"
else
  BS="1M"
fi

dd if=/dev/urandom of="$DEMO_DIR/node_modules/bundle.bin" bs=$BS count=20 2>/dev/null
dd if=/dev/urandom of="$DEMO_DIR/dist/build.bin" bs=$BS count=5 2>/dev/null
dd if=/dev/urandom of="$DEMO_DIR/.next/cache.bin" bs=$BS count=8 2>/dev/null
dd if=/dev/urandom of="$DEMO_DIR/backend/venv/lib.bin" bs=$BS count=10 2>/dev/null

echo "Demo project reset. Current size:"
du -sh "$DEMO_DIR"

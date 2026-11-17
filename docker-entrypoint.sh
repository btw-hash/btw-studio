#!/bin/sh
set -e
if [ -n "$BRIEF_LOG_DIR" ]; then
  mkdir -p "$BRIEF_LOG_DIR"
  chown -R node:node "$BRIEF_LOG_DIR"
fi
exec su-exec node "$@"

#!/bin/sh
set -eu

: "${RUSTFS_HOST:?RUSTFS_HOST not set}"
: "${RUSTFS_ACCESS_KEY:?RUSTFS_ACCESS_KEY not set}"
: "${RUSTFS_SECRET_KEY:?RUSTFS_SECRET_KEY not set}"

rc alias set local "$RUSTFS_HOST" "$RUSTFS_ACCESS_KEY" "$RUSTFS_SECRET_KEY"
rc bucket create --ignore-existing "local/plane"
rc bucket cors set local/plane - <<'EOF'
{
  "rules": [
    {
      "allowedOrigins": ["https://plane.app.home.arpa"],
      "allowedMethods": ["GET", "POST", "PUT", "DELETE", "HEAD"],
      "allowedHeaders": ["*"],
      "exposeHeaders": [
        "ETag",
        "x-amz-server-side-encryption",
        "x-amz-request-id",
        "x-amz-id-2"
      ],
      "maxAgeSeconds": 3000
    }
  ]
}
EOF

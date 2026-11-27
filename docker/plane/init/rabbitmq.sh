#!/bin/sh
set -eu

: "${RMQ_USERNAME:?RMQ_USERNAME not set}"
: "${RMQ_PASSWORD:?RMQ_PASSWORD not set}"
: "${PLANE_RMQ_PASSWORD:?PLANE_RMQ_PASSWORD not set}"

BASE_URL="http://rabbitmq:15672/api"
AUTH="$RMQ_USERNAME:$RMQ_PASSWORD"
RMQ_VHOST=plane

curl -fsS -u "$AUTH" --retry 5 --retry-delay 2 --retry-all-errors "$BASE_URL/overview" >/dev/null

curl -fsS -u "$AUTH" -X PUT "$BASE_URL/vhosts/$RMQ_VHOST"

curl -fsS -u "$AUTH" -X PUT "$BASE_URL/users/plane" \
  -H 'content-type: application/json' \
  -d "{\"password\":\"$PLANE_RMQ_PASSWORD\",\"tags\":\"\"}"

curl -fsS -u "$AUTH" -X PUT "$BASE_URL/permissions/$RMQ_VHOST/plane" \
  -H 'content-type: application/json' \
  -d '{"configure":".*","write":".*","read":".*"}'

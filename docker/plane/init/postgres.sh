#!/bin/sh
set -eu

: "${PLANE_DB_PASSWORD:?PLANE_DB_PASSWORD not set}"

psql -v ON_ERROR_STOP=1 --dbname=postgres -v pw="$PLANE_DB_PASSWORD" <<'EOSQL'
SELECT format('CREATE ROLE plane LOGIN PASSWORD %L', :'pw')
WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'plane')
\gexec
SELECT format('ALTER ROLE plane PASSWORD %L', :'pw')
\gexec

SELECT 'CREATE DATABASE plane OWNER plane'
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'plane')
\gexec
EOSQL

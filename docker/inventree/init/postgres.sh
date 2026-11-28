#!/bin/sh
set -eu

: "${INVENTREE_DB_PASSWORD:?INVENTREE_DB_PASSWORD not set}"

psql -v ON_ERROR_STOP=1 --dbname=postgres -v pw="$INVENTREE_DB_PASSWORD" <<'EOSQL'
SELECT format('CREATE ROLE inventree LOGIN PASSWORD %L', :'pw')
WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'inventree')
\gexec
SELECT format('ALTER ROLE inventree PASSWORD %L', :'pw')
\gexec

SELECT 'CREATE DATABASE inventree OWNER inventree'
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'inventree')
\gexec
EOSQL

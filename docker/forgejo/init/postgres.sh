#!/bin/sh
set -eu

: "${FORGEJO_DB_PASSWORD:?FORGEJO_DB_PASSWORD not set}"

psql -v ON_ERROR_STOP=1 --dbname=postgres -v pw="$FORGEJO_DB_PASSWORD" <<'EOSQL'
SELECT format('CREATE ROLE forgejo LOGIN PASSWORD %L', :'pw')
WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'forgejo')
\gexec
SELECT format('ALTER ROLE forgejo PASSWORD %L', :'pw')
\gexec

SELECT 'CREATE DATABASE forgejo OWNER forgejo TEMPLATE template0 ENCODING ''UTF8'''
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'forgejo')
\gexec
EOSQL

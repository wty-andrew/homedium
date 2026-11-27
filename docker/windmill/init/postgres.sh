#!/bin/sh
set -eu

: "${WINDMILL_DB_PASSWORD:?WINDMILL_DB_PASSWORD not set}"

# Login role and database. The app role is not a superuser. CREATEDB lets
# Windmill create its datatable, DuckLake and wm_fork_* databases.
psql -v ON_ERROR_STOP=1 --dbname=postgres -v pw="$WINDMILL_DB_PASSWORD" <<'EOSQL'
SELECT format('CREATE ROLE windmill LOGIN CREATEDB PASSWORD %L', :'pw')
WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'windmill')
\gexec
SELECT format('ALTER ROLE windmill PASSWORD %L', :'pw')
\gexec

SELECT 'CREATE DATABASE windmill OWNER windmill'
WHERE NOT EXISTS (SELECT 1 FROM pg_database WHERE datname = 'windmill')
\gexec

SELECT 'CREATE ROLE windmill_user'
WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'windmill_user')
\gexec
SELECT 'CREATE ROLE windmill_admin WITH BYPASSRLS'
WHERE NOT EXISTS (SELECT 1 FROM pg_roles WHERE rolname = 'windmill_admin')
\gexec

GRANT windmill_user TO windmill_admin;
GRANT windmill_admin TO windmill;
GRANT windmill_user TO windmill;
EOSQL

# Schema grants from init-db-as-superuser.sql (v1.875.0), applied inside the
# windmill database.
psql -v ON_ERROR_STOP=1 --dbname=windmill <<'EOSQL'
GRANT USAGE ON SCHEMA public TO windmill_user, windmill_admin;
GRANT ALL ON ALL TABLES IN SCHEMA public TO windmill_user;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO windmill_user;

-- Migrations run as `windmill`, so the default privileges must target that
-- role. The upstream script's version only covers objects postgres creates.
ALTER DEFAULT PRIVILEGES FOR ROLE windmill IN SCHEMA public
    GRANT ALL ON TABLES TO windmill_user;
ALTER DEFAULT PRIVILEGES FOR ROLE windmill IN SCHEMA public
    GRANT ALL ON SEQUENCES TO windmill_user;
EOSQL

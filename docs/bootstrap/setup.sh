#!/bin/bash
set -euo pipefail

## This script bootstraps a VM environment to install our server resources.
## Must be run as root (default for Vagrant bootstrap process).

# Edit the following to change the name of the database user that will be created:
APP_DB_USER=app
APP_DB_PASS=dbpass
# Edit the following to change the name of the database that is created (defaults to the user name)
APP_DB_NAME="$APP_DB_USER"

export DEBIAN_FRONTEND=noninteractive

log () {
    echo "$@" 1>&2    
}

err () {
    echo "$@" 1>&2
    exit 1
}

# Helper to run psql as the postgres super user
psql_super () {
    sudo -i -u postgres -- psql "$@"
}

print_db_usage () {
    local APP_DB_VM_PORT="25432"
cat << _EOF_
Your PostgreSQL database has been setup and can be accessed on your local machine on the forwarded port (default: 25432)
    Host: localhost
    Port: ${APP_DB_VM_PORT}
    Database: ${APP_DB_NAME}
    Username: ${APP_DB_USER}
    Password: ${APP_DB_PASS}
  
  Admin access to postgres user via VM:
    vagrant ssh
    sudo su - postgres
  
  psql access to app database user via VM:
    vagrant ssh
    sudo su - postgres
    PGUSER=$APP_DB_USER PGPASSWORD=${APP_DB_PASS} psql -h localhost ${APP_DB_NAME}
  
  Env variable for application development:
    DATABASE_URL=postgresql://${APP_DB_USER}:${APP_DB_PASS}@localhost:${APP_DB_VM_PORT}/${APP_DB_NAME}
  
  Local command to access the database via psql:
    PGUSER=$APP_DB_USER PGPASSWORD=${APP_DB_PASS} psql -h localhost -p ${APP_DB_VM_PORT} ${APP_DB_NAME}
_EOF_
}

main () {
    (( EUID == 0 )) || err "This script must be run as root"

    log "Adding PGDG repository key"
    wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | apt-key add -
    log "Adding PGDG apt repo"
    sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ $(lsb_release -cs)-pgdg main" > /etc/apt/sources.list.d/pgdg.list'

    log "Updating package metadata"
    apt-get update

    log "Updating base packages"
    apt-get -y upgrade

    log "Installing PostgreSQL"
    apt-get -y install \
      postgresql \
      postgresql-contrib

    local postgres_version="$(ls -tr /etc/postgresql | tail -1)"
    local postgres_conf_dir="/etc/postgresql/${postgres_version}/main"
    
    # Modify PostgreSQL server config to listen on all network  interfaces
    echo "listen_addresses = '*'" >> "${postgres_conf_dir}/postgresql.conf"
    # Append to HBA to allow inbound connections via TCP
    echo "host    all             all             all                     md5" >> "${postgres_conf_dir}/pg_hba.conf"
    # Restart PostgreSQL server so that updated configuration takes effect
    service postgresql restart

    # Create the app database user
    psql_super \
      -c "CREATE USER ${APP_DB_USER}
          WITH
            PASSWORD '$APP_DB_PASS'"
    # Create the app database owned by app database user
    psql_super \
      -c "CREATE DATABASE $APP_DB_NAME
          WITH
            OWNER = $APP_DB_USER"
    # Add some extensions
    psql_super \
      -d "${APP_DB_NAME}" \
      -c "CREATE SCHEMA pgcrypto" \
      -c "CREATE EXTENSION pgcrypto WITH SCHEMA pgcrypto" \
      -c "GRANT USAGE ON SCHEMA pgcrypto TO public"

    print_db_usage
}

main "$@"

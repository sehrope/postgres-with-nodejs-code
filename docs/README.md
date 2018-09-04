# Setup

## VM Creation
First initialize the VM via:

    $ vagrant up

This will:

* Create the VM
* Install the latest version of PostgreSQL
* Configure the PostgreSQL server to allow inbound connections
* Create an app user
* Create an app database
* Forward the 5432 port for the VM to a port on your local machine (default: 25432)

## Environment variables
The default values for the environment variables align with the values in docs/env.example.
To use the defaults copy docs/env.example to .env in the project root

    $ cp docs/env.example .env

## Running psql
For convenience the script bin/psql is setup to connect to the app database.
No extra parameters or config is required and by default it will use the DATABASE_URL environment variable or read the .env file.

Any command line options are passed as-is to psql. Example:

    $ bin/psql -c 'SELECT USER' 
    user 
    ------
    app
    (1 row)

## Running psql as the postgres super user
To run psql as the super user you must first enter the VM via SSH:

    $ vagrant ssh

You'll then get a prompt with something like:

    vagrant@ubuntu-bionic:~$

Then run the following to get a psql prompt as the postgres super user:

    vagrant@ubuntu-bionic:~$ sudo -i -u postgres -- psql

Or if you want to connect to a specific database as the postgres super use (say to install an extension) you can do that via:

    vagrant@ubuntu-bionic:~$ sudo -i -u postgres -- psql app

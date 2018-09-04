default: help

help:
	echo "Run 'make vm schema' to build the VM and sample schema"

vm:
	vagrant up

schema:
	bin/psql -X -v ON_ERROR_STOP=1 -f docs/schema/main.sql

.PHONY: default help vm schema


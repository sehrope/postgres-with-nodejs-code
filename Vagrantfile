# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu/bionic64"

  # Forward the default port for PostgreSQL from 5432 within the VM to 25432 on our local machine
  config.vm.network "forwarded_port", guest: 5432, host: 25432

  # Bootstrap script to initialize server resources
  config.vm.provision "shell", path: "docs/bootstrap/setup.sh"
end

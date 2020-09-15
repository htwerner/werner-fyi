#!/bin/bash

## git clone https://github.com/htwerner/werner-fyi.git
## cd werner-fyi
## . setup.sh
## . start.sh


# Update/upgrade apt-get
sudo apt-get update
yes Y | sudo apt-get upgrade

# Install/enable docker
yes Y | sudo apt install docker.io
sudo systemctl start docker
sudo systemctl enable docker

# Install docker compose
sudo apt install curl
sudo curl -L "https://github.com/docker/compose/releases/download/1.26.1/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Install node.js
sudo apt -y install curl dirmngr apt-transport-https lsb-release ca-certificates
curl -sL https://deb.nodesource.com/setup_12.18.2 | sudo -E bash -
sudo apt -y install nodejs
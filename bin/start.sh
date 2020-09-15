#!/bin/bash

# Build
cd web
sudo gradle clean build
cd ..
sudo docker-compose build
sudo docker-compose up -d
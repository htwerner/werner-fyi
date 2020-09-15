#!/bin/bash

# Kill apps
sudo docker-compose down
sudo docker rmi website:latest
sudo docker rmi api:latest
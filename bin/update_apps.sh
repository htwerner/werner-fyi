#!/bin/bash

# Restart apps
. bin/kill.sh
sudo git pull
. bin/start.sh

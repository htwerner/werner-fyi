#!/usr/bin bash

# Restart apps
. kill_apps.sh
git pull
. start_apps.sh
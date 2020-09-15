#!/bin/bash

# Restart apps
. bin/kill.sh
git pull
. bin/start.sh

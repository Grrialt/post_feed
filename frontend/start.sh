#!/bin/sh

GREEN='\033[1;32m'
NC='\033[0m' # No Color

start () {
  echo The app is starting!
  parcel index.html
}

alert () {
  echo "======================================================"
  echo "It looks like you forgot to set your environment variables"
  echo ">> Set the environment variables in the CI/CD settings"
  echo "======================================================"
}

# Check if the required environment variables are set
if [ -z "$CONTRACT_NAME" ]; then
  alert
else
  start
fi

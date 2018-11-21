#!/bin/bash

#
#
# Script to set up CF with the orgs, spaces, apps and services needed to run the Stratos E2E tests
#
# By default this script runs against PCF Dev. To use against another CF, manually login to that CF
# and run this script with the argument 'nologin'

if [ ! "$1" == "nologin" ]; then 
  cf login -a https://api.local.pcfdev.io --skip-ssl-validation -u admin -p admin -o system -s system
else
  # Check we are logged in
  cf orgs &> /dev/null
  if [ $? -ne 0 ]; then
    echo "You must use 'cf login' to login to your Cloud Foundry first."
    exit 1
  fi
fi


echo "Removing old Apps/Services/Orgs from E2E Tests"
echo "=============================================="

cf api

# Platform name (Linux, Darwin etc)
unamestr=`uname`

DRYRUN="false"
if [ "$1" == "-d" -o  "$2" == "-d" ]; then
  DRYRUN="true"
  echo "Dry run - will not delete anything"
fi

function clean() {
  local ITEMS=$1
  local PREFIX=$2
  local CMD=$3
  local REGEX="^($PREFIX)(.*)\.([0-9]*)[Tt]([0-9]*)[zZ].*"
  local NOW=$(date "+%s")

  while IFS= read -r line
  do
    NAME="${line%% *}"
    if [[ $NAME =~ $REGEX ]]; then
      DS="${BASH_REMATCH[3]}"
      TS="${BASH_REMATCH[4]}"
      TS="${TS:0:6}"
      TIMESTAMP=$(echo $TIMESTAMP | awk '{print toupper($0)}')
      EPOCH=$(date -j -f "%Y%m%d:%H%M%S" "$DS:$TS" "+%s")
#      if [[ "$unamestr" == 'Darwin' ]]; then
#        EPOCH=$(date -j -f "%Y-%M-%dT%T" $TIMESTAMP "+%s")
#      else
#        EPOCH=$(date -d $TIMESTAMP "+%s")
#      fi
      DIFF=$(($NOW-$EPOCH))
      if [ $DIFF -gt 43200 ]; then
        if [ $DRYRUN == "false" ]; then
          echo "$NAME  [DELETE]"
          cf $CMD $NAME -f
        else
          echo "$NAME  [DELETE - DRYRUN]"
        fi
      else
        echo "$NAME  [OK]"
      fi
    fi
  done <<< "$ITEMS"
}

echo "Cleaning old Orgs"
ORGS="$(cf orgs | tail -n +5)"
clean "$ORGS" "acceptance\.e2e\.travis" "delete-org"

cf target -o e2e -s e2e

echo "Cleaning old Applications in e2e org/space"
APPS="$(cf apps | tail -n +5)"
# clean "$APPS" "acceptance\.e2e\..*\." "delete"
clean "$APPS" "acceptance\.e2e\." "delete"

echo "Cleaning old Service Instances in e2e org/space"
SERVICES="$(cf services | tail -n +5)"
clean "$SERVICES" "acceptance\.e2e\." "delete-service"

echo "Done"
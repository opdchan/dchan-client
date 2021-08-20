#!/bin/bash
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )"

cd $SCRIPT_DIR/../dapp

docker-compose run dapp yarn build

$SCRIPT_DIR/serve_build.sh

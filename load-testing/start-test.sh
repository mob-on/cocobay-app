#!/bin/bash
if [ $# = 0 ]; then
    echo "Usage: yarn load-test <pathToTestFiles>"
    exit 1
fi

docker compose -f docker-compose-load-test.yml up -d --build

args=""
for param in "$@"; do
  args+="/test/$param "
done
args=$(echo "$args" | sed 's/[[:space:]]*$//')

docker compose -f docker-compose-load-test.yml exec k6 k6 run $args
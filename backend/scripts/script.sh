#!/usr/bin/env bash

sleep 2
yarn prisma:migrate

exec "$@"
#!/bin/bash

cd backend/ && npm ci

npm install -g @nestjs/cli

npm run prisma:generate
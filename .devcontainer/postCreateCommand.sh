#!/bin/bash

# Install dependencies
cd backend/ && npm ci

# Install NestJS CLI
npm install -g @nestjs/cli

# Generate Prisma Client
npm run prisma:generate

# Generate Prisma Migrations
npx prisma db push --force-reset && npx prisma db seed

# Docker daemon setup
sudo chown node:node /var/run/docker.sock

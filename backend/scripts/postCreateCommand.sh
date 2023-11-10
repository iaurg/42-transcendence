#!/bin/bash

# Install dependencies
cd backend/ && npm i

# Install NestJS CLI
npm install -g @nestjs/cli

# Generate Prisma Client
npx prisma generate

# Generate Prisma Migrations
npx prisma db push --force-reset && npx prisma db seed

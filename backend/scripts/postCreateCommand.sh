#!/bin/bash

# Generate Prisma Client
npx prisma generate

# Generate Prisma Migrations
npx prisma db push --force-reset && npx prisma db seed

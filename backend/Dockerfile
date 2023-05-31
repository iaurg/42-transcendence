###################
# BUILD FOR LOCAL DEVELOPMENT
###################

# Base image
FROM node:18 AS development

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY --chown=node:node package*.json ./

# Install dependencies
RUN npm ci
RUN npm install -g @nestjs/cli

# Copy source code
COPY --chown=node:node . .

# Generate Prisma database client code
RUN npm run prisma:generate

ENTRYPOINT [ "npm", "run", "start:dev" ]

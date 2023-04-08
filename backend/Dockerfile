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

# Copy source code
COPY --chown=node:node . .

# Generate Prisma database client code
RUN npm run prisma:generate

# Use the node user from the image (instead of the root user)
USER node

###################
# BUILD FOR PRODUCTION
###################

# Base image
FROM node:18 AS build

# Set working directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY --chown=node:node package*.json ./

# Copy node modules NestJS CLI
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules  

COPY --chown=node:node . .

# Run the build command
RUN npm run build

# Set environment variables
ENV NODE_ENV production

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Use the node user from the image (instead of the root user)
USER node

###################
# PRODUCTION
###################

FROM node:18-alpine As production

# Copy the bundled code from the build stage to the production image
COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist

# Start the server using the production build
CMD [ "node", "dist/main.js" ]
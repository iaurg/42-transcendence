ARG NODE_VERSION=20-alpine
###################
# LOCAL DEVELOPMENT
###################
FROM node:${NODE_VERSION} As development

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

RUN npm ci

COPY --chown=node:node . .

USER node

#######
# BUILD
#######
FROM node:${NODE_VERSION} As build

WORKDIR /usr/src/app

COPY --chown=node:node package*.json ./

COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules

COPY --chown=node:node . .

RUN npm run prisma:generate

RUN npm run build

ENV NODE_ENV production

RUN npm ci --only=production && npm cache clean --force

USER node

############
# PRODUCTION
############
FROM node:${NODE_VERSION} As production

WORKDIR /usr/src/app

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node package*.json ./

EXPOSE 3000

CMD [ "npm", "run", "start:prod" ]

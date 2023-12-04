FROM node:20-alpine as base
WORKDIR /usr/src/app

##############
# DEPENDENCIES
##############
FROM base AS dependencies
# https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
RUN apk add --no-cache libc6-compat

COPY --chown=node:node package*.json ./

RUN npm ci

#############
# DEVELOPMENT
#############
FROM base as development

COPY --from=dependencies /usr/src/app/node_modules ./node_modules
COPY . .

RUN npm run prisma:generate

CMD ["npm", "run", "start:dev"]

# ##########
# PRODUCTION
# ##########
FROM base as production
ENV NODE_ENV=production

COPY --from=dependencies --chown=node:node /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .

RUN npm run prisma:generate
RUN npm run build
RUN npm ci --omit=dev && npm cache clean --force

USER node

EXPOSE 3000

CMD ["npm", "run", "start:docker"]

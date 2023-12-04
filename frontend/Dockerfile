FROM node:20-alpine AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED 1

##############
# DEPENDENCIES
##############
FROM base AS dependencies
# https://github.com/nodejs/docker-node/tree/b4117f9333da4138b03a546ec926ef50a31506c3#nodealpine
RUN apk add --no-cache libc6-compat

COPY package*.json ./

RUN npm ci

#############
# DEVELOPMENT
#############
FROM base AS development

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

CMD ["npm", "run", "dev"]

#######
# BUILD
#######
FROM base AS build

COPY --from=dependencies /app/node_modules ./node_modules
COPY . .

RUN npm run build

############
# PRODUCTION
############
FROM base AS production
ENV NODE_ENV production
ENV PORT 9090
ENV HOSTNAME "0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# RUN mkdir .next
# RUN chown nextjs:nodejs .next

COPY --from=build /app/public ./public
COPY --from=build --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=build --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 9090

CMD ["node", "server.js"]

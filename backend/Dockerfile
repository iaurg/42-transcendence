FROM node:18-alpine

WORKDIR /usr/src/app/server
ENV NODE_ENV=production

COPY . .

# Install nestjs cli
RUN npm install -g @nestjs/cli
RUN npm install
RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start:docker" ]


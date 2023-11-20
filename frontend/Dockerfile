FROM node:18-alpine

WORKDIR /usr/src/app/client

COPY . .

RUN npm install
RUN npm i sharp
RUN npm run build

EXPOSE 9090

CMD [ "npm", "run", "start"]

FROM node:18

WORKDIR /usr/src/app/server

COPY . .

RUN npm i
RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start:docker" ]


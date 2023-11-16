FROM node:18

WORKDIR /usr/src/app/client

COPY . .

RUN npm install
RUN npm build

EXPOSE 9090

CMD [ "npm", "run", "start", "--port", "9090" ]


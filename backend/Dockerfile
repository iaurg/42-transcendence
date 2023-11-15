FROM node:18

WORKDIR /usr/src/app/server

COPY . .

RUN npm i
RUN npm run build

# Run postCreate script
RUN chmod a+x ./scripts/postCreateCommand.sh

EXPOSE 3000

CMD [ "npm", "run", "start" ]


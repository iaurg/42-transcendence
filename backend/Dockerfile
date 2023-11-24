FROM node:18

WORKDIR /usr/src/app/server

COPY . .

RUN yarn install
RUN yarn build

RUN chmod +x ./scripts/script.sh
RUN mv ./scripts/script.sh /usr/local/bin/script.sh

EXPOSE 3000

ENTRYPOINT [ "script.sh" ]
CMD [ "yarn", "start" ]
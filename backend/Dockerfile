FROM node:latest

WORKDIR /usr/src/app/server

# Copy the rest of your application
COPY . .

# Install dependencies
RUN npm install

# Build your application
RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "start:docker" ]
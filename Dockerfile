FROM node:8.11.1-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
COPY . /usr/src/app
RUN npm install

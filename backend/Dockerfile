FROM node:13.2.0-alpine3.10 as builder
RUN apk update
RUN apk add alpine-sdk
RUN mkdir /app
WORKDIR /app
COPY package.json /app
COPY package-lock.json /app
RUN npm ci
COPY . /app
RUN npm run build
ENTRYPOINT [ "npm", "run", "start" ]
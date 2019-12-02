FROM node:13.2.0-alpine3.10 as builder
RUN apk update
RUN apk add python2 alpine-sdk libsass libsass-dev
RUN mkdir /app
WORKDIR /app
COPY package.json /app
COPY package-lock.json /app
RUN npm ci
COPY . /app
RUN npm run build
RUN ls -la

FROM nginx:1.17.6-alpine
COPY --from=builder /app/dist /usr/share/nginx/html
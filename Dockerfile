FROM node:21
WORKDIR /app
COPY package*.json ./
RUN yarn
COPY . .
RUN yarn run build

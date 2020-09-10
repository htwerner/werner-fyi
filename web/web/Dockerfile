FROM node:10
MAINTAINER Hunter Werner "htwerner@gmail.com"
COPY . /web
WORKDIR /web
RUN npm install
EXPOSE 5000
ENTRYPOINT npm run start

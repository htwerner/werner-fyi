FROM node:10
MAINTAINER Hunter Werner "htwerner@gmail.com"
COPY . /test
WORKDIR /test
RUN npm install
EXPOSE 5000
ENTRYPOINT npm run build

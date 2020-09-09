FROM node:10
MAINTAINER Hunter Werner "htwerner@gmail.com"
COPY . /web
WORKDIR /web
RUN npm install
EXPOSE 5000
CMD ["npm", "run build"]

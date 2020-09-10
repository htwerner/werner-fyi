FROM abiosoft/caddy
MAINTAINER Hunter Werner "htwerner@gmail.com"
COPY ./web/dist app/
WORKDIR app
EXPOSE 80 443 2015
CMD ["--conf", "/etc/Caddyfile", "--log", "stdout"]

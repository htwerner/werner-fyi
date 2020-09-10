FROM openjdk:8-jdk-alpine
MAINTAINER Hunter Werner "htwerner@gmail.com"

COPY build/libs/web.jar .
RUN chmod 755 web.jar

EXPOSE 5000
ENTRYPOINT ["java", "-jar", "web.jar"]
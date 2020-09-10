FROM openjdk:8-jdk-alpine
MAINTAINER Hunter Werner "htwerner@gmail.com"

COPY build/libs/web.jar /home/ubuntu/
RUN chmod 755 /home/ubuntu/web.jar

EXPOSE 5000
ENTRYPOINT ["java", "-jar", "web.jar"]
FROM python:3.7
MAINTAINER Hunter Werner "htwerner@gmail.com"

COPY envs/prod.yml prod.yml
RUN conda env create -q --file prod.yml

COPY . api
WORKDIR api
ENV DEBUG=False
EXPOSE 8000
ENTRYPOINT gunicorn -c python:api.config._gunicorn api.wsgi:app
FROM python:3.8
MAINTAINER Hunter Werner "htwerner@gmail.com"

ENV VIRTUAL_ENV=/opt/venv
RUN python3 -m venv $VIRTUAL_ENV
ENV PATH="$VIRTUAL_ENV/bin:$PATH"

COPY requirements.txt requirements.txt
RUN pip install -r requirements.txt

COPY . api
WORKDIR api
ENV DEBUG=False
EXPOSE 8000
ENTRYPOINT ["bash", "gunicorn"]
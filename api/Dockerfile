FROM python:3.7
MAINTAINER Hunter Werner "htwerner@gmail.com"
COPY . /api
WORKDIR /api
RUN pip install -r requirements.txt
EXPOSE 8000
CMD ["python", "app.py"]
FROM python:alpine3.17
WORKDIR /user/src/app
COPY requirements.txt ./
RUN pip install -r requirements.txt
RUN pip install gunicorn
COPY . .
EXPOSE 8000

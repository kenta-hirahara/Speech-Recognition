FROM python:3.13.2-slim

WORKDIR /app

COPY requirements.txt /app/

RUN pip install --upgrade pip && \
    pip install -r requirements.txt

COPY . /app/

EXPOSE 5000

CMD ["python3", "run.py"]

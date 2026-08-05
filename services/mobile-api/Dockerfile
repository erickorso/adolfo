FROM python:3.12-slim

WORKDIR /app

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    MOBILE_API_PORT=4002

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY app ./app

EXPOSE 4002
CMD ["sh", "-c", "uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-${MOBILE_API_PORT:-4002}}"]

FROM python:3.10-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
EXPOSE 5000
# Best practice: Run as non-root
RUN useradd -m nonroot
USER nonroot
CMD ["python", "app.py"]
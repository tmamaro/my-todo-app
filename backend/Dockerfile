FROM python:3.9-slim

# Install system dependencies, including libpq-dev
RUN apt-get update && apt-get install -y \
    libpq-dev \
    gcc \
    python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Set work directory
WORKDIR /app

# Copy your requirements.txt file into the container
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the app into the container
COPY . .

# Set environment variable for FastAPI to run
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]

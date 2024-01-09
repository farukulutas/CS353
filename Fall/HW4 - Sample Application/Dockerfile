# Use a specific Python version
FROM python:3.9-slim-buster

# Set working directory
WORKDIR /app

# Update package list and install system dependencies
RUN apt-get update && \
    apt-get install -y gcc default-libmysqlclient-dev && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install a specific pip version
RUN pip install --upgrade pip==21.3.1

# Copy requirements and install Python packages
COPY requirements.txt .
RUN pip install -r requirements.txt

# Copy other project files
COPY . .

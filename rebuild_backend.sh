#!/bin/bash

# Name of the Docker Compose service
SERVICE_NAME="backend"

echo "Building the JAR file..."
docker exec -it erp_prod_backend ./gradlew clean build -x test

echo "Restarting service ${SERVICE_NAME}..."
docker-compose restart $SERVICE_NAME

echo "The application has been rebuilt and restarted."

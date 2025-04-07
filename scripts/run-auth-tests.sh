#!/bin/bash

# Script to run auth e2e tests with test database

# Check if docker is running
docker ps > /dev/null 2>&1
if [ $? -ne 0 ]; then
    echo "Docker is not running. Please start Docker first."
    exit 1
fi

# Check if .env.test exists
if [ ! -f .env.test ]; then
    echo ".env.test file not found"
    exit 1
fi

# Check if jest.preset.js exists
if [ ! -f jest.preset.js ]; then
    echo "jest.preset.js file not found in root directory"
    exit 1
fi

# Export NODE_ENV for test environment
export NODE_ENV=test

# Start containers with env file
echo "Starting test environment containers..."
docker-compose -f docker-compose.test.yaml --env-file .env.test up -d

# Extract values from .env.test for use in the script
AUTH_DATABASE_USERNAME=$(grep AUTH_DATABASE_USERNAME .env.test | cut -d '=' -f2)
AUTH_DATABASE_DB_NAME=$(grep AUTH_DATABASE_DB_NAME .env.test | cut -d '=' -f2)
AUTH_HOST=$(grep AUTH_HOST .env.test | cut -d '=' -f2)
AUTH_PORT=$(grep AUTH_PORT .env.test | cut -d '=' -f2)

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL test database to be ready..."
MAX_RETRIES=10
RETRY_COUNT=0
DB_READY=false

while [ $RETRY_COUNT -lt $MAX_RETRIES ] && [ "$DB_READY" = false ]; do
    if docker exec postgres-auth-test pg_isready -U "$AUTH_DATABASE_USERNAME" -d "$AUTH_DATABASE_DB_NAME" > /dev/null 2>&1; then
        DB_READY=true
        echo "PostgreSQL test database is ready."
    else
        RETRY_COUNT=$((RETRY_COUNT+1))
        if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
            echo "PostgreSQL not ready, retrying in 2 seconds... (Attempt $RETRY_COUNT/$MAX_RETRIES)"
            sleep 2
        else
            echo "PostgreSQL test database not ready after multiple attempts."
            echo "Check the container logs with: docker logs postgres-auth-test"
            exit 1
        fi
    fi
done

# Run migrations using the test env file
echo "Running database migrations on test database..."
npx nx run auth:migration:test:run

if [ $? -ne 0 ]; then
    echo "Migration failed. Check database connection and permissions."
    exit 1
fi

# Check if auth service is running
AUTH_URL="http://${AUTH_HOST}:${AUTH_PORT}/health"
echo "Checking if auth service is running at $AUTH_URL..."

# Try to connect to auth service health endpoint
if curl -s "$AUTH_URL" > /dev/null 2>&1; then
    echo "Auth service is already running."
else
    echo "Auth service is not running. Starting it now..."
    # Start auth service using the correct nx serve command with test configuration
    npx nx serve auth --configuration=test > auth-test.log 2>&1 &
    AUTH_PID=$!
    echo "Auth service started with PID $AUTH_PID"
    
    # Wait for auth service to start
    echo "Waiting for auth service to start..."
    MAX_RETRIES=10
    RETRY_COUNT=0
    AUTH_READY=false
    
    while [ $RETRY_COUNT -lt $MAX_RETRIES ] && [ "$AUTH_READY" = false ]; do
        if curl -s "$AUTH_URL" > /dev/null 2>&1; then
            AUTH_READY=true
            echo "Auth service is now running."
        else
            RETRY_COUNT=$((RETRY_COUNT+1))
            if [ $RETRY_COUNT -lt $MAX_RETRIES ]; then
                echo "Auth service not ready, retrying in 3 seconds... (Attempt $RETRY_COUNT/$MAX_RETRIES)"
                sleep 3
            else
                echo "Auth service failed to start after multiple attempts."
                echo "Check the logs in auth-test.log for more information."
                # Kill the auth service process if it's still running
                if ps -p $AUTH_PID > /dev/null; then
                    kill $AUTH_PID
                fi
                exit 1
            fi
        fi
    done
fi

# Run the e2e tests with env flag
echo "Running auth e2e tests..."
NODE_ENV=test DOTENV_CONFIG_PATH=.env.test npx nx e2e auth-e2e

TEST_EXIT_CODE=$?

# Prompt to keep or tear down test environment
read -p "Do you want to keep the test environment running? (y/n): " KEEP_ENV
if [ "$KEEP_ENV" != "y" ]; then
    echo "Tearing down test environment..."
    docker-compose -f docker-compose.test.yaml down
    
    # Check if we started the auth service and kill it
    if [ ! -z "$AUTH_PID" ]; then
        if ps -p $AUTH_PID > /dev/null; then
            echo "Stopping auth service (PID $AUTH_PID)..."
            kill $AUTH_PID
        fi
    fi
fi

# Print completion message
if [ $TEST_EXIT_CODE -eq 0 ]; then
    echo "Auth e2e tests completed successfully."
else
    echo "Auth e2e tests failed with exit code $TEST_EXIT_CODE."
fi

exit $TEST_EXIT_CODE 

#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Function to check if a port is in use
check_port() {
    local port=$1
    local service=$2
    
    if lsof -i :$port > /dev/null; then
        echo -e "${GREEN}✓ $service is running on port $port${NC}"
        return 0
    else
        echo -e "${RED}✗ $service is not running on port $port${NC}"
        return 1
    fi
}

# Function to start a service if it's not running
start_service() {
    local service=$1
    local port=$2
    
    if ! check_port $port $service; then
        echo -e "${YELLOW}Starting $service...${NC}"
        npx nx serve $service --configuration=test &
        # Wait for service to start
        sleep 5
    fi
}

# Check if gateway is running
GATEWAY_PORT=4000
if ! check_port $GATEWAY_PORT "Gateway"; then
    echo -e "${YELLOW}Starting Gateway service...${NC}"
    npx nx serve gateway --configuration=test &
    # Wait for gateway to start
    sleep 5
fi

# Check if auth is running
AUTH_PORT=6001
if ! check_port $AUTH_PORT "Auth"; then
    echo -e "${YELLOW}Starting Auth service...${NC}"
    npx nx serve auth --configuration=test &
    # Wait for auth to start
    sleep 5
fi

# Check if order is running
ORDER_PORT=6002
if ! check_port $ORDER_PORT "Order"; then
    echo -e "${YELLOW}Starting Order service...${NC}"
    npx nx serve order --configuration=test &
    # Wait for order to start
    sleep 5
fi

# Start test databases and Redis if needed
echo -e "${YELLOW}Starting test databases and Redis...${NC}"
docker-compose -f docker-compose.test.yaml up -d

# Wait for services to be ready
echo -e "${YELLOW}Waiting for services to be ready...${NC}"
sleep 10

# Run the specified E2E test
if [ -z "$1" ]; then
    echo -e "${YELLOW}No test specified. Running all E2E tests...${NC}"
    npx nx run-many --target=e2e --projects=auth-e2e,order-e2e
else
    echo -e "${YELLOW}Running $1 E2E tests...${NC}"
    npx nx e2e $1
fi

# Clean up
echo -e "${YELLOW}Cleaning up...${NC}"
docker-compose -f docker-compose.test.yaml down

echo -e "${GREEN}E2E tests completed!${NC}" 
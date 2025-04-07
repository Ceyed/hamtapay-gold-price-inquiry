# HamtapayGoldPriceInquiry

A microservices-based system for gold price inquiry and order management.

## Project Overview

This project is built using a microservices architecture with the following components:

-   [Gateway Service](./apps/gateway/README.md) - API Gateway and main entry point
-   [Auth Service](./apps/auth/README.md) - Authentication and authorization
-   [Market Data Service](./apps/market-data/README.md) - Gold price and market data
-   [Order Service](./apps/order/README.md) - Order management
-   [Pricing Service](./apps/pricing/README.md) - Price calculations
-   [Notification Service](./apps/notification/README.md) - User notifications

## Getting Started

### Prerequisites

-   Node.js (v18 or later)
-   Docker and Docker Compose
-   pnpm

### Installation

1. Clone the repository
2. Install dependencies:
    ```sh
    pnpm install
    ```

### Development Environment

1. Copy environment file:

    ```sh
    cp .env.sample .env
    ```

2. Start the services:

    ```sh
    docker-compose -f docker-compose.yaml --env-file .env up -d
    ```

3. Run database migrations:

    ```sh
    npx nx migration:run auth
    npx nx migration:run order
    ```

4. Run all services:

    ```sh
    npx nx run-many --target=serve --all
    ```

    Or run services individually:

    ```sh
    npx nx serve gateway
    npx nx serve auth
    npx nx serve order
    # ... etc
    ```

### Test Environment

1. Copy test environment file:

    ```sh
    cp .env.sample .env.test
    ```

2. Start the test services:

    ```sh
    docker-compose -f docker-compose.test.yaml --env-file .env.test up -d
    ```

3. Run test database migrations:

    ```sh
    npx nx migration:test:run auth
    npx nx migration:test:run order
    ```

4. Run all services in test mode:

    ```sh
    npx nx run-many --target=serve --all --configuration=test
    ```

    Or run test services individually:

    ```sh
    npx nx serve gateway --configuration=test
    npx nx serve auth --configuration=test
    npx nx serve order --configuration=test
    # ... etc
    ```

5. Run end-to-end tests:
    ```sh
    npx nx e2e auth-e2e
    npx nx e2e order-e2e
    ```

## API Documentation

A Postman collection export is available in the root directory (`HGPI.postman_collection.json`). You can import this file into Postman to access all API endpoints with pre-configured requests.

## Project Structure

-   `apps/` - Microservices applications
-   `libs/` - Shared libraries and utilities
-   `docker-compose.yaml` - Docker configuration for services
-   `docker-compose.test.yaml` - Docker configuration for testing
-   `HGPI.postman_collection.json` - Postman collection for API endpoints
-   `libs/shared/config/services.config.ts` - Service configuration with ports and URLs

## Documentation

Each service has its own README file with detailed information about its functionality, configuration, and API endpoints. The documentation is organized as follows:

-   [Gateway Service](./apps/gateway/README.md)
-   [Auth Service](./apps/auth/README.md)
-   [Market Data Service](./apps/market-data/README.md)
-   [Order Service](./apps/order/README.md)
-   [Pricing Service](./apps/pricing/README.md)
-   [Notification Service](./apps/notification/README.md)

## Known Issues

-   There are no Pagination implementation for list routes
-   No filters on list routes
-   Gateway app requires TypeORM configuration

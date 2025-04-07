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
    npx nx serve gateway
    npx nx serve auth
    npx nx serve notification
    npx nx serve order
    npx nx serve market-data
    npx nx serve pricing
    ```

### Test Environment

1.  Copy test environment file:

    ```sh
    cp .env.sample .env.test
    ```

2.  Start the test services:

    ```sh
    docker-compose -f docker-compose.test.yaml --env-file .env.test up -d
    ```

3.  Run test database migrations:

    ```sh
    npx nx migration:test:run auth
    npx nx migration:test:run order
    ```

4.  Run all services in test mode:

    ```sh
    npx nx serve gateway --configuration=test
    npx nx serve auth --configuration=test
    npx nx serve notification --configuration=test
    npx nx serve order --configuration=test
    npx nx serve market-data --configuration=test
    npx nx serve pricing --configuration=test
    ```

5.  Run end-to-end tests:
    ```sh
    npx nx e2e auth-e2e
    npx nx e2e order-e2e
    ```

## API Documentation

A Postman collection export is available in the root directory (`HGPI.postman_collection.json`). You can import this file into Postman to access all API endpoints with pre-configured requests.

## Project Structure

This project is built using a modern microservices architecture with the following technical stack:

### Architecture

-   **Nx Monorepo**: The entire project is managed as a single monorepo using Nx, which provides efficient build caching and dependency management
-   **Microservices**: Six independent services, each with its own responsibility:
    -   Gateway Service: API Gateway and main entry point
    -   Auth Service: Authentication and authorization
    -   Market Data Service: Gold price and market data
    -   Order Service: Order management
    -   Pricing Service: Price calculations
    -   Notification Service: User notifications

### Communication

-   **gRPC**: Services communicate with each other using gRPC, providing efficient, type-safe communication
-   **REST API**: External clients interact with the system through REST APIs exposed by the Gateway service

### Data Storage

-   **PostgreSQL**: Primary database for persistent storage
-   **Redis**: Used for caching and temporary data storage

### Technologies

-   **NestJS**: Backend framework for all microservices
-   **TypeORM**: Database ORM for PostgreSQL
-   **JWT**: Authentication tokens
-   **Nodemailer**: Email notifications

## Documentation

Each service has its own README file with detailed information about its functionality, configuration, and API endpoints. The documentation is organized as follows:

-   [Gateway Service](./apps/gateway/README.md)
-   [Auth Service](./apps/auth/README.md)
-   [Market Data Service](./apps/market-data/README.md)
-   [Order Service](./apps/order/README.md)
-   [Pricing Service](./apps/pricing/README.md)
-   [Notification Service](./apps/notification/README.md)

## Development Journey

This project was developed under a tight deadline and involved a large scope, consisting of six microservices with complex interactions. While [several issues](#known-issues) were identified during development, time constraints prevented all of them from being addressed.

At the time, I had limited experience with microservices and had never worked with tools like Nx, gRPC, or end-to-end testing. As a result, a significant portion of the time was spent learning these technologies. The first day and a half were dedicated to researching project structure, exploring best practices, and seeking advice from friends.

Despite the challenges, the project provided a valuable learning experience and helped me grow significantly as a developer.

## Known Issues

-   There are no Pagination implementation for list routes
-   No filters on list routes
-   Gateway app requires TypeORM configuration
-   Test migration commands prioritize `.env` file over `.env.test` even though they should read from `.env.test`. When working with test migrations, rename or remove `.env` so only `.env.test` exists.

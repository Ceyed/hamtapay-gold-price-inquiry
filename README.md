# 🏪 HamtapayGoldPriceInquiry (HGPI)

A sophisticated microservices-based dynamic pricing system for an online gold store. This system intelligently adjusts gold prices in real-time based on global market rates and inventory levels, ensuring optimal pricing and operational efficiency.

## Key Features

### Dynamic Pricing

-   Real-time price adjustments based on global gold rates
-   Intelligent inventory-based pricing strategies
-   High-performance price calculation engine

### Order Management

-   Seamless gold purchase order processing
-   Real-time inventory tracking
-   Low-latency order fulfillment

### Market Data Integration

-   Live gold price updates from external APIs
-   Efficient data caching and sharing
-   Optimized API usage to prevent rate limiting

### Smart Notifications

-   Automated purchase invoice generation
-   Inventory level alerts
-   Real-time status updates

## Architecture & Technical Stack

This project implements a modern microservices architecture with six core services:

### Core Services

-   **Gateway Service**: API Gateway and main entry point
-   **Auth Service**: Authentication and authorization
-   **Market Data Service**: Gold price and market data
-   **Order Service**: Order management
-   **Pricing Service**: Price calculations
-   **Notification Service**: User notifications

### Technology Stack

-   **Framework**: NestJS
-   **Monorepo**: Nx
-   **Communication**:
    -   gRPC for internal service communication
    -   REST APIs for external clients
-   **Databases**:
    -   PostgreSQL for persistent storage
    -   Redis for caching and temporary data
-   **Authentication**: JWT
-   **Email**: Nodemailer

## 🚀 Getting Started

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
    npx nx serve gateway --configuration=test
    npx nx serve auth --configuration=test
    npx nx serve notification --configuration=test
    npx nx serve order --configuration=test
    npx nx serve market-data --configuration=test
    npx nx serve pricing --configuration=test
    ```

5. Run end-to-end tests:
    ```sh
    npx nx e2e auth-e2e
    npx nx e2e order-e2e
    ```

## 📚 Documentation

Each service has its own README file with detailed information about its functionality, configuration, and API endpoints:

-   [Gateway Service](./apps/gateway/README.md)
-   [Auth Service](./apps/auth/README.md)
-   [Market Data Service](./apps/market-data/README.md)
-   [Order Service](./apps/order/README.md)
-   [Pricing Service](./apps/pricing/README.md)
-   [Notification Service](./apps/notification/README.md)

A Postman collection export is available in the root directory (`HGPI.postman_collection.json`). You can import this file into Postman to access all API endpoints with pre-configured requests.

## 🛠 Development Journey

This project was developed under a tight deadline and involved a large scope, consisting of six microservices with complex interactions. While [several issues](#known-issues) were identified during development, time constraints prevented all of them from being addressed.

At the time, I had limited experience with microservices and had never worked with tools like Nx, gRPC, or end-to-end testing. As a result, a significant portion of the time was spent learning these technologies. The first day and a half were dedicated to researching project structure, exploring best practices, and seeking advice from friends.

I had to skip some of the tests due to a time crunch. I covered the basics, but there are a few more I wanted to add.

Despite the challenges, the project provided a valuable learning experience and helped me grow significantly as a developer.

## ⚠️ Known Issues

-   There are no Pagination implementation for list routes
-   No filters on list routes
-   Gateway app requires TypeORM configuration
-   Test migration commands prioritize `.env` file over `.env.test` even though they should read from `.env.test`. When working with test migrations, rename or remove `.env` so only `.env.test` exists.

# Order Service

## Overview

The Order service is a core component of the HamtapayGoldPriceInquiry system, responsible for managing orders, products, and stock operations. It provides functionality for creating orders, managing product inventory, and tracking stock history.

## Architecture

The service is built using:

-   NestJS framework
-   gRPC for communication
-   TypeORM for database operations
-   Redis for caching
-   PostgreSQL for data persistence

## Features

### Order Management

-   Create new orders
-   Retrieve order lists
-   Order validation and processing
-   Integration with pricing service for gold price calculations
-   Order notifications via notification service

### Product Management

-   Product listing
-   Admin-specific product views (more detailed)

### Stock Operations

-   Stock-in product functionality
-   Stock history tracking

## Data Models

### Order

-   Order details
-   Customer information
-   Product information
-   Price information

### Product

-   Product details
-   Stock information
-   Price information

### Stock History

-   Stock operation details
-   Timestamp
-   Product information
-   Operation type

## Development

To run the service locally:

```bash
npx nx serve order
```

## Testing

Run e2e tests:

```bash
npx nx e2e order-e2e
```

## Dependencies

The service integrates with:

-   Pricing Service: For gold price calculations
-   Notification Service: For order notifications
-   Redis: For caching and data storage
-   PostgreSQL: For persistent data storage

## Related Documentation

-   [Gateway Service](../gateway/README.md)
-   [Auth Service](../auth/README.md)
-   [Notification Service](../notification/README.md)
-   [Pricing Service](../pricing/README.md)

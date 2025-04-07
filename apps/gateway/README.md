# Gateway Service

The Gateway service acts as the main entry point for all client requests, handling routing, authentication, and request/response transformation.

## Overview

The Gateway service is responsible for:

-   Routing requests to appropriate microservices
-   Authentication and authorization
-   Request/response transformation

## Architecture

The service is built using:

-   NestJS framework
-   REST API endpoints
-   gRPC for communication with microservices
-   TypeORM for database access
-   JWT for authentication

## API Endpoints

The service exposes the following REST endpoints:

### Auth Endpoints (`/api/users`)

-   `POST /signup` - Register a new user
-   `POST /verify-account` - Verify user account with verification code
-   `POST /send-verification-code` - Send verification code to user email
-   `POST /signin` - Authenticate user and return tokens
-   `POST /refresh-token` - Refresh access token using refresh token
-   `PUT /assign-role` - Assign role to a user (Admin only)
-   `GET /all/admin` - Get list of all users (Admin only)

### Order Endpoints (`/api/orders`)

-   `POST /` - Create a new order
-   `GET /all/admin` - Get list of all orders (Admin only)

### Product Endpoints (`/api/products`)

-   `GET /all` - Get list of all products
-   `GET /all/admin` - Get list of all products (Admin only)
-   `POST /stock-in` - Add stock to a product (Admin only)

### Stock History Endpoints (`/api/stock`)

-   `GET /history/admin` - Get stock history (Admin only)

## Development

To run the service locally:

```sh
npx nx serve gateway
```

## Related Documentation

-   [Auth Service](../auth/README.md)
-   [Order Service](../order/README.md)

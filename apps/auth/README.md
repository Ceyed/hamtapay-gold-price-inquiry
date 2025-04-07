# Auth Service

The Auth service handles user authentication, authorization, and role management for the HamtapayGoldPriceInquiry system.

## Overview

The Auth service provides the following functionality:

-   User registration (signup)
-   Two-step verification process
-   User authentication (signin)
-   Token refresh
-   Role assignment
-   User listing

### Default Users

For convenience, the system comes with two pre-configured users:

1. Admin User

    - Username: `admin`
    - Password: `123`
    - Role: Administrator
    - Access: Full system access

2. Regular User
    - Username: `user`
    - Password: `123`
    - Role: User
    - Access: Standard user privileges

## Authentication Flow

### Two-Step Signup Process

1. Initial Registration

    - User registers with basic information
    - Account is created as non-verified
    - Verification code is sent to user's email

2. Email Verification
    - User must verify their email using the sent code
    - Account is marked as verified upon successful verification
    - Only verified users can login and place orders

### Login Process

-   Only verified users can login
-   Successful login generates JWT tokens
-   Tokens are used for subsequent authenticated requests

## Architecture

The service is built using:

-   NestJS framework
-   gRPC for communication
-   TypeORM for database access
-   Redis for caching
-   JWT for token management

## API Endpoints

The service exposes the following gRPC endpoints:

-   `signup` - Register a new user
-   `verifyAccount` - Verify user account with verification code
-   `sendVerificationCode` - Send verification code to user email
-   `signin` - Authenticate user and return tokens
-   `refreshToken` - Refresh access token using refresh token
-   `assignRole` - Assign role to a user
-   `getUserList` - Get list of all users

## Configuration

Required environment variables:

-   JWT secret key
-   Token expiration times
-   Database configuration
-   Redis configuration
-   Service URLs and ports

## Development

To run the service locally:

```sh
npx nx serve auth
```

## Testing

To run e2e tests:

```sh
npx nx e2e auth-e2e
```

## Database Migrations

To run migrations:

```sh
npx nx migration:run auth
```

To run test migrations:

```sh
npx nx migration:test:run auth
```

## Related Documentation

-   [Project README](../../README.md)
-   [Gateway Service](../gateway/README.md)
-   [Notification Service](../notification/README.md)
-   [Order Service](../order/README.md)
-   [Pricing Service](../pricing/README.md)
-   [Market Data Service](../market-data/README.md)

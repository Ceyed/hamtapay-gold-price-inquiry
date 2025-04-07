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

-   [Project README](../../README.md).
-   [Gateway Service](../gateway/README.md)
-   [Notification Service](../notification/README.md)

# Notification Service

The Notification service handles email notifications for the HamtapayGoldPriceInquiry system.

## Overview

The Notification service is responsible for:

-   Sending confirmation codes via email
-   Handling order registration notifications
-   Alerting administrators about low stock levels (when stock falls below 10%)

## Architecture

The service is built using:

-   NestJS framework
-   gRPC for communication
-   Redis for user data access
-   Nodemailer for email sending

## API Endpoints

The service exposes the following gRPC endpoints:

-   `orderRegistered` - Send notification when an order is registered (Sends confirmation email to customer with order details)
-   If current stock is below 10%, sends alert email to administrators
-   `sendEmailConfirmationCode` - Send confirmation code via email

## Email Templates

The service supports the following email templates:

-   `InvoiceConfirmation` - For order confirmations
-   `NotifyAdmins` - For notifying administrators when stock levels are low (below 10%)
-   `ConfirmationCode` - For sending verification codes

## Development

To run the service locally:

```sh
npx nx serve notification
```

## Related Documentation

-   [Gateway Service](../gateway/README.md)
-   [Auth Service](../auth/README.md)
-   [Order Service](../order/README.md)

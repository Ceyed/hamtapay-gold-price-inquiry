# Market Data Service

The Market Data service provides real-time gold price information for the HamtapayGoldPriceInquiry system.

## Overview

The Market Data service is responsible for:

-   Fetching and providing current gold prices
-   Caching gold price data in Redis
-   Scheduling regular price updates

## Architecture

The service is built using:

-   NestJS framework
-   gRPC for communication
-   Redis for caching
-   Scheduled tasks for regular updates

## API Endpoints

The service exposes the following gRPC endpoint:

-   `getGoldPrice` - Get the current gold price

## Scheduling

The service includes scheduled tasks for fetching gold prices:

-   Business Hours: Every 5 minutes, Monday–Friday, from 9:00 to 16:55
-   Off Hours: Once every hour on weekends

## Development

To run the service locally:

```sh
npx nx serve market-data
```

## Related Documentation

-   [Project README](../../README.md)
-   [Gateway Service](../gateway/README.md)
-   [Auth Service](../auth/README.md)
-   [Notification Service](../notification/README.md)
-   [Order Service](../order/README.md)
-   [Pricing Service](../pricing/README.md)

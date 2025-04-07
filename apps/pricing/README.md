# Pricing Service

## Overview

The Pricing service is a critical component of the HamtapayGoldPriceInquiry system, responsible for calculating gold prices based on market data and stock levels. It provides real-time price calculations for different gold gram weights while considering current stock levels.

## Architecture

The service is built using:

-   NestJS framework
-   gRPC for communication
-   Redis for caching market data
-   Integration with Market Data service for real-time gold prices

## Features

### Price Calculation

-   Real-time gold price calculations
-   Support for different gold gram weights
-   Dynamic pricing based on stock levels
-   Caching of market data for improved performance

### Stock-Based Pricing

-   Adjusts prices based on current stock levels
-   Considers total stock capacity
-   Implements pricing strategies for low stock situations

## API Endpoints

The service exposes the following gRPC endpoint:

-   `calculatePrice`: Calculates the price for a specific gold gram weight
    -   Input: current stock, total stock, and gold grams
    -   Output: calculated price based on market data and stock levels

## Data Flow

1. Market Data Integration

    - Fetches real-time gold prices from Market Data service
    - Caches prices in Redis for quick access
    - Implements timeout handling for market data requests

2. Price Calculation Process
    - Retrieves cached market data
    - Applies stock-based pricing adjustments
    - Returns final calculated price

## Development

To run the service locally:

```bash
npx nx serve pricing
```

## Dependencies

The service integrates with:

-   Market Data Service: For real-time gold prices
-   Redis: For caching market data
-   Order Service: For stock level information

## Related Documentation

-   [Project README](../../README.md)
-   [Gateway Service](../gateway/README.md)
-   [Auth Service](../auth/README.md)
-   [Notification Service](../notification/README.md)
-   [Order Service](../order/README.md)
-   [Market Data Service](../market-data/README.md)

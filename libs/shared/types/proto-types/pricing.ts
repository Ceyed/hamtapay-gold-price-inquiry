// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.12.4
// source: libs/proto/pricing.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { ErrorInterface } from "./common";

export const protobufPackage = "pricing";

export interface CalculatePriceInterface {
  grams: string;
  currentStock: number;
  totalStock: number;
}

export interface CalculatePriceResponse {
  data: number;
  success: boolean;
  error: ErrorInterface | undefined;
}

export const PRICING_PACKAGE_NAME = "pricing";

export interface PricingServiceClient {
  calculatePrice(request: CalculatePriceInterface): Observable<CalculatePriceResponse>;
}

export interface PricingServiceController {
  calculatePrice(
    request: CalculatePriceInterface,
  ): Promise<CalculatePriceResponse> | Observable<CalculatePriceResponse> | CalculatePriceResponse;
}

export function PricingServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["calculatePrice"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("PricingService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("PricingService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const PRICING_SERVICE_NAME = "PricingService";

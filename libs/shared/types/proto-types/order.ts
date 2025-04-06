// Code generated by protoc-gen-ts_proto. DO NOT EDIT.
// versions:
//   protoc-gen-ts_proto  v2.7.0
//   protoc               v3.12.4
// source: libs/proto/order.proto

/* eslint-disable */
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";
import { Empty, ErrorInterface } from "./common";

export const protobufPackage = "order";

export interface CreateOrderInterface {
  customerId: string;
  goldGrams: string;
  amount: number;
}

export interface CreateOrderResponse {
  data: OrderProtoType | undefined;
  success: boolean;
  error: ErrorInterface | undefined;
}

export interface GetOrderListResponse {
  data: OrderProtoType[];
  success: boolean;
  error: ErrorInterface | undefined;
}

export interface GetProductListResponse {
  data: ProductProtoType[];
  success: boolean;
  error: ErrorInterface | undefined;
}

export interface GetProductListByAdminResponse {
  data: ProductProtoType[];
  success: boolean;
  error: ErrorInterface | undefined;
}

export interface OrderProtoType {
  id: string;
  createdAt: string;
  updatedAt: string;
  customerId: string;
  goldGrams: string;
  amount: number;
  gramPrice: number;
  totalPrice: number;
}

export interface StockHistoryProtoType {
  id: string;
  createdAt: string;
  updatedAt: string;
  type: string;
  amount: number;
  productId: string;
  product: ProductProtoType | undefined;
}

export interface ProductProtoType {
  id: string;
  createdAt: string;
  updatedAt: string;
  goldGrams: string;
  currentStock: number;
  totalStock: number;
  orders: OrderProtoType[];
  stockHistories: StockHistoryProtoType[];
}

export const ORDER_PACKAGE_NAME = "order";

export interface OrderServiceClient {
  createOrder(request: CreateOrderInterface): Observable<CreateOrderResponse>;

  getOrderList(request: Empty): Observable<GetOrderListResponse>;

  getProductList(request: Empty): Observable<GetProductListResponse>;

  getProductListByAdmin(request: Empty): Observable<GetProductListByAdminResponse>;
}

export interface OrderServiceController {
  createOrder(
    request: CreateOrderInterface,
  ): Promise<CreateOrderResponse> | Observable<CreateOrderResponse> | CreateOrderResponse;

  getOrderList(request: Empty): Promise<GetOrderListResponse> | Observable<GetOrderListResponse> | GetOrderListResponse;

  getProductList(
    request: Empty,
  ): Promise<GetProductListResponse> | Observable<GetProductListResponse> | GetProductListResponse;

  getProductListByAdmin(
    request: Empty,
  ): Promise<GetProductListByAdminResponse> | Observable<GetProductListByAdminResponse> | GetProductListByAdminResponse;
}

export function OrderServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["createOrder", "getOrderList", "getProductList", "getProductListByAdmin"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("OrderService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("OrderService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const ORDER_SERVICE_NAME = "OrderService";

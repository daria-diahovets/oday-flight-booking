import { client } from './client';
import type { Passenger } from '../schemas/booking.schema';
import type { OrderSummary, OrderDetail } from '../types/order';

export interface OrderPassengersPayload {
  flightId: string;
  adults: Passenger[];
  children: Passenger[];
}

export interface CreateOrderIntentResult {
  clientSecret: string;
  totalPrice: number;
}

export interface ConfirmOrderPayload extends OrderPassengersPayload {
  paymentIntentId: string;
}

export interface ConfirmOrderResult {
  orderId: string;
  totalPrice: number;
  createdAt: string;
}

export const ordersApi = {
  getMy: () => client.get<OrderSummary[]>('/api/orders'),
  getById: (id: string) => client.get<OrderDetail>(`/api/orders/${id}`),
  createIntent: (payload: OrderPassengersPayload) =>
    client.post<CreateOrderIntentResult>('/api/orders/intent', payload),
  confirm: (payload: ConfirmOrderPayload) =>
    client.post<ConfirmOrderResult>('/api/orders/confirm', payload),
};

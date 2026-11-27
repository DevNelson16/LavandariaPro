import api from '../api';
import type { Order, CreateOrderData } from '../../types/orders';

export async function getOrders(): Promise<Order[]> {
  const response = await api.get<Order[]>('/orders');
  return response.data;
}

export async function createOrder(data: CreateOrderData): Promise<Order> {
  const response = await api.post<Order>('/orders', data);
  return response.data;
}
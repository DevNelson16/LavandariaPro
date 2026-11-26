import api from '../api';
import type { Order } from '../../types/orders';

export async function getOrders(): Promise<Order[]> {
  const response = await api.get<Order[]>('/orders');

  return response.data;
}
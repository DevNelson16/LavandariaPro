import api from '../api';
import type { Customer } from '../../types/customers';

export async function getCustomers(): Promise<Customer[]> {
  const response = await api.get<Customer[]>('/customers');
  return response.data;
}
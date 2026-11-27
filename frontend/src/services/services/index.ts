
import api from '../api';
import type { LaundryService } from '../../types/services';
export async function getServices(): Promise<LaundryService[]> {
  const response = await api.get<LaundryService[]>('/services');
  return response.data;
}

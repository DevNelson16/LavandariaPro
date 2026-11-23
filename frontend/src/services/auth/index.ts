import api from '../api';
import type { LoginCredentials, AuthResponse } from '../../types/auth';

export async function login(credentials: LoginCredentials): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', credentials);

  return response.data;
}
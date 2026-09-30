import { client } from './client';
import type { User } from '../types/user';

export interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export const authApi = {
  register: (payload: RegisterPayload) =>
    client.post<User>('/api/auth/register', payload),
  login: (payload: LoginPayload) =>
    client.post<User>('/api/auth/login', payload),
  logout: () => client.post<void>('/api/auth/logout'),
  me: () => client.get<User>('/api/auth/me'),
};

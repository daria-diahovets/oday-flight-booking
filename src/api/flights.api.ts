import { client } from './client';
import type { Flight } from '../types/flight';

export interface FlightSearchParams {
  from?: string;
  to?: string;
  date?: string;
  limit?: number;
  offset?: number;
}

export interface FlightSearchResult {
  flights: Flight[];
  total: number;
}

function buildQuery(params: FlightSearchParams): string {
  const query = new URLSearchParams();
  if (params.from) query.set('from', params.from);
  if (params.to) query.set('to', params.to);
  if (params.date) query.set('date', params.date);
  if (params.limit !== undefined) query.set('limit', String(params.limit));
  if (params.offset !== undefined) query.set('offset', String(params.offset));
  const qs = query.toString();
  return qs ? `?${qs}` : '';
}

export const flightsApi = {
  search: (params: FlightSearchParams = {}) =>
    client.get<FlightSearchResult>(`/api/flights${buildQuery(params)}`),
  getById: (id: string) => client.get<Flight>(`/api/flights/${id}`),
};

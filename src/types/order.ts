export interface OrderSummary {
  id: string;
  total_price: string;
  created_at: string;
  origin_city: string;
  destination_city: string;
  departure_time: string;
  arrival_time: string;
  airline_name: string;
  adults_count: number;
  children_count: number;
}

export interface OrderTicket {
  first_name: string;
  last_name: string;
  type: 'adult' | 'child';
  price: string;
}

export interface OrderDetail {
  id: string;
  total_price: string;
  created_at: string;
  origin_city: string;
  destination_city: string;
  departure_time: string;
  arrival_time: string;
  airline_name: string;
  tickets: OrderTicket[];
}

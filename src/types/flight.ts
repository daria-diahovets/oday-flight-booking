export interface Flight {
  id: string;
  origin_city: string;
  destination_city: string;
  departure_time: string;
  arrival_time: string;
  price_adult: string;
  price_child: string;
  seats_available?: number;
  seats_total?: number;
  airline_name: string;
}

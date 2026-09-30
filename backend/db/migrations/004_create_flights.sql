CREATE TABLE IF NOT EXISTS flights (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    airline_id UUID NOT NULL REFERENCES airlines(id) ON DELETE RESTRICT,
    origin_city_id UUID NOT NULL REFERENCES cities(id) ON DELETE RESTRICT,
    destination_city_id UUID NOT NULL REFERENCES cities(id) ON DELETE RESTRICT,
    departure_time TIMESTAMPTZ NOT NULL,
    arrival_time TIMESTAMPTZ NOT NULL,
    price_adult NUMERIC(10, 2) NOT NULL,
    price_child NUMERIC(10, 2) NOT NULL,
    seats_total INTEGER NOT NULL,
    seats_available INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT different_cities CHECK (origin_city_id <> destination_city_id),
    CONSTRAINT valid_flight_times CHECK (arrival_time > departure_time),
    CONSTRAINT valid_seats CHECK (seats_available >= 0 AND seats_available <= seats_total)
);

CREATE INDEX idx_flights_route ON flights (origin_city_id, destination_city_id);
CREATE INDEX idx_flights_departure_time ON flights (departure_time);

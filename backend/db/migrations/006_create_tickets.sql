CREATE TABLE IF NOT EXISTS tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    flight_id UUID NOT NULL REFERENCES flights(id) ON DELETE RESTRICT,
    passenger_first_name VARCHAR(100) NOT NULL,
    passenger_last_name VARCHAR(100) NOT NULL,
    passenger_type VARCHAR(10) NOT NULL,
    price NUMERIC(10, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT valid_passenger_type CHECK (passenger_type IN ('adult', 'child'))
);

CREATE INDEX idx_tickets_order_id ON tickets (order_id);
CREATE INDEX idx_tickets_flight_id ON tickets (flight_id);

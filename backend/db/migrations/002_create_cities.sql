CREATE TABLE IF NOT EXISTS cities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    iata_code CHAR(3) UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS airlines (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(150) NOT NULL,
    iata_code CHAR(2) UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

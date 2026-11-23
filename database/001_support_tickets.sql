CREATE TABLE IF NOT EXISTS support_tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  ticket_number BIGINT GENERATED ALWAYS AS IDENTITY UNIQUE,
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  name VARCHAR(100) NOT NULL,
  contact VARCHAR(120) NOT NULL,
  topic VARCHAR(20) NOT NULL CHECK (topic IN ('tech','purchase','consult','other')),
  message TEXT NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'open'
    CHECK (status IN ('open','in_progress','answered','closed')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_support_tickets_customer
ON support_tickets(customer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status
ON support_tickets(status, created_at DESC);

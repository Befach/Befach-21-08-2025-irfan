-- Add client_phone column to shipments table for WhatsApp notifications
ALTER TABLE shipments ADD COLUMN client_phone VARCHAR(20);

-- Add a comment to document the column
COMMENT ON COLUMN shipments.client_phone IS 'Client phone number for sending WhatsApp notifications';

-- Create an index on client_phone for better query performance
CREATE INDEX idx_shipments_client_phone ON shipments(client_phone);

-- Add a check constraint to ensure phone format (optional)
ALTER TABLE shipments 
ADD CONSTRAINT check_client_phone_format 
CHECK (client_phone ~* '^\+?[\d\s\-\(\)]+$');














-- Add client_email column to shipments table
-- This script should be run in your Supabase SQL editor

-- Add the client_email column
ALTER TABLE shipments 
ADD COLUMN client_email VARCHAR(255);

-- Add a comment to document the column
COMMENT ON COLUMN shipments.client_email IS 'Client email address for sending tracking notifications';

-- Create an index on client_email for better query performance
CREATE INDEX idx_shipments_client_email ON shipments(client_email);

-- Add a check constraint to ensure email format (optional)
ALTER TABLE shipments 
ADD CONSTRAINT check_client_email_format 
CHECK (client_email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$'); 
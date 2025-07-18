-- Add trigger to automatically update updated_at field
-- Run these commands in your Supabase SQL editor

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for shipments table
DROP TRIGGER IF EXISTS update_shipments_updated_at ON shipments;
CREATE TRIGGER update_shipments_updated_at
    BEFORE UPDATE ON shipments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for shipment_documents table
DROP TRIGGER IF EXISTS update_shipment_documents_updated_at ON shipment_documents;
CREATE TRIGGER update_shipment_documents_updated_at
    BEFORE UPDATE ON shipment_documents
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create trigger for shipment_stages table
DROP TRIGGER IF EXISTS update_shipment_stages_updated_at ON shipment_stages;
CREATE TRIGGER update_shipment_stages_updated_at
    BEFORE UPDATE ON shipment_stages
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Ensure updated_at column exists and has default value
ALTER TABLE shipments 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE shipment_documents 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

ALTER TABLE shipment_stages 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing records to have updated_at equal to created_at if it's null
UPDATE shipments SET updated_at = created_at WHERE updated_at IS NULL;
UPDATE shipment_documents SET updated_at = created_at WHERE updated_at IS NULL;
UPDATE shipment_stages SET updated_at = created_at WHERE updated_at IS NULL; 
-- Add country column to quotes table for notifications
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS country TEXT;

-- Update existing records with default country values (optional)
UPDATE quotes 
SET country = 'United States' 
WHERE country IS NULL;

-- Create an index on country for better query performance
CREATE INDEX IF NOT EXISTS idx_quotes_country ON quotes(country);

-- Create an index on created_at for better query performance when fetching recent estimates
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at DESC);

-- Verify the changes
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'quotes' 
AND column_name = 'country';

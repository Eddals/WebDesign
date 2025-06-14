-- Create newsletter_subscribers table
CREATE TABLE newsletter_subscribers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_email_sent TIMESTAMP WITH TIME ZONE,
    source VARCHAR(50) DEFAULT 'website_footer'
);

-- Create index for faster lookups
CREATE INDEX idx_newsletter_email ON newsletter_subscribers(email);
CREATE INDEX idx_newsletter_status ON newsletter_subscribers(status);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_newsletter_timestamp()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update the updated_at column
CREATE TRIGGER update_newsletter_subscribers_timestamp
BEFORE UPDATE ON newsletter_subscribers
FOR EACH ROW
EXECUTE FUNCTION update_newsletter_timestamp();

-- Sample insert query (for reference)
-- INSERT INTO newsletter_subscribers (name, email) 
-- VALUES ('John Doe', 'john@example.com');

-- Sample query to get all active subscribers
-- SELECT name, email FROM newsletter_subscribers WHERE status = 'active' ORDER BY created_at DESC;

-- Sample query to count subscribers by month
-- SELECT 
--   DATE_TRUNC('month', created_at) AS signup_month,
--   COUNT(*) AS new_subscribers
-- FROM newsletter_subscribers
-- GROUP BY DATE_TRUNC('month', created_at)
-- ORDER BY signup_month;
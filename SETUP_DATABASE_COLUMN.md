# 🗄️ Database Column Setup for Estimate Form

## Quick Setup (2 minutes)

### Step 1: Add Required Columns to Database

Go to your **Supabase SQL Editor** and run this command:

```sql
-- Add country column for notifications
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS country TEXT;

-- Add features column for storing selected features
ALTER TABLE quotes ADD COLUMN IF NOT EXISTS features JSONB DEFAULT '[]'::jsonb;

-- Update existing records
UPDATE quotes SET country = 'United States' WHERE country IS NULL;
UPDATE quotes SET features = '[]'::jsonb WHERE features IS NULL;

-- Add indexes for performance
CREATE INDEX IF NOT EXISTS idx_quotes_country ON quotes(country);
CREATE INDEX IF NOT EXISTS idx_quotes_created_at ON quotes(created_at DESC);
```

### Step 2: Test the Setup

Run this command in your terminal:

```bash
node scripts/verify-database-setup.js
```

### Step 3: Test the Form

1. Start your dev server: `npm run dev`
2. Go to: `http://localhost:5173/estimate`
3. Fill out the form with a country selection
4. Submit the form
5. Check notifications on other pages

## What This Adds

### New Database Columns

| Column | Type | Purpose |
|--------|------|---------|
| `country` | TEXT | Stores user's country for notifications |
| `features` | JSONB | Stores selected features as JSON array |

### Form Enhancements

- ✅ **Country Dropdown**: 30+ countries to choose from
- ✅ **Database Integration**: All form data saves to Supabase
- ✅ **Real Notifications**: Shows actual customer submissions
- ✅ **Features Storage**: Saves selected features (SEO, Analytics, etc.)

### Notification System

- ✅ **Live Data**: Pulls from actual form submissions
- ✅ **Country Display**: Shows where estimates are coming from
- ✅ **Smart Fallback**: Works even when database is empty
- ✅ **Professional Terms**: Uses "estimate" instead of "quote"

## Verification Checklist

After running the setup, verify these work:

- [ ] Estimate form loads without errors
- [ ] Country dropdown appears and works
- [ ] Form submission succeeds
- [ ] Data appears in Supabase `quotes` table
- [ ] Notifications show real customer data
- [ ] Country information displays in notifications

## Troubleshooting

### "Column does not exist" error
```sql
-- Run this in Supabase SQL Editor
ALTER TABLE quotes ADD COLUMN country TEXT;
ALTER TABLE quotes ADD COLUMN features JSONB DEFAULT '[]'::jsonb;
```

### Form submission fails
1. Check browser console for errors
2. Verify `.env` file has correct Supabase credentials
3. Check table permissions in Supabase dashboard

### No notifications appearing
1. Submit a test estimate first
2. Wait 5-15 seconds for first notification
3. Check browser console for errors
4. Verify fallback notifications work

## Database Schema

Your `quotes` table now includes:

```sql
CREATE TABLE quotes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc', now()),
    full_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    company TEXT,
    country TEXT,              -- NEW: For notifications
    project_type TEXT,
    description TEXT,
    budget_range TEXT,
    timeline TEXT,
    features JSONB DEFAULT '[]'::jsonb,  -- NEW: Selected features
    status TEXT DEFAULT 'pending'
);
```

## Success Indicators

When everything is working:

- ✅ Form submits successfully
- ✅ Data appears in Supabase dashboard
- ✅ Notifications show real customer names
- ✅ Country information displays correctly
- ✅ No console errors
- ✅ Verification script passes all tests

## Next Steps

Once the database is set up:

1. **Test the form** thoroughly with different countries
2. **Monitor notifications** on your homepage
3. **Check Supabase dashboard** to see saved estimates
4. **Customize countries list** if needed (in `src/pages/Estimate.tsx`)

Your estimate form is now fully integrated with the database and will show real-time notifications! 🎉

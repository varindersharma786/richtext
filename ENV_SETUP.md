# Environment Setup

## Required Environment Variables

Create a `.env.local` file in the root directory with the following variables:

### Supabase Configuration

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### PayPal Configuration

```
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id_for_frontend
PAYPAL_CLIENT_ID=your_paypal_client_id_for_backend
PAYPAL_CLIENT_SECRET=your_paypal_client_secret
```

## Getting PayPal Credentials

1. **Create PayPal Developer Account**
   - Go to [PayPal Developer Dashboard](https://developer.paypal.com/dashboard/)
   - Sign up or log in with your PayPal account

2. **Create a Sandbox App**
   - Navigate to "Apps & Credentials"
   - Switch to "Sandbox" mode (for testing)
   - Click "Create App"
   - Enter your app name
   - Click "Create App"

3. **Get Your Credentials**
   - After creating the app, you'll see:
     - **Client ID**: Use this for both `NEXT_PUBLIC_PAYPAL_CLIENT_ID` and `PAYPAL_CLIENT_ID`
     - **Secret**: Click "Show" to reveal, use this for `PAYPAL_CLIENT_SECRET`

4. **Configure App Settings**
   - Under "App settings", make sure:
     - Return URL: `http://localhost:3000` (for local development)
     - Enable "Accept Payments" feature

## Database Migration

Run the migration to add new columns:

1. **Using Supabase Dashboard:**
   - Go to your Supabase project dashboard
   - Navigate to SQL Editor
   - Copy the contents of `supabase/migrations/20250126_product_enhancements.sql`
   - Paste and run the SQL

2. **Using Supabase CLI** (if installed):

   ```bash
   supabase db push
   ```

3. **Verify Migration:**
   - Check that `products` table has `image_urls` column (text[])
   - Check that `orders` table has `payment_provider` and `payment_id` columns

## Storage Buckets

Ensure you have a "products" storage bucket in Supabase:

1. Go to Supabase Dashboard → Storage
2. Create a bucket named "products" if it doesn't exist
3. Set bucket to "Public"
4. Configure RLS policies for upload (admin only) and read (public)

## Development

```bash
npm run dev
```

Visit `http://localhost:3000`

##Testing PayPal

1. Use PayPal Sandbox accounts for testing
2. Go to [Sandbox Accounts](https://developer.paypal.com/dashboard/accounts)
3. Use the test buyer account credentials when checking out

## Important Notes

- **Currency**: The app currently converts INR to USD for PayPal (1 USD = 83 INR). Adjust the conversion rate in `/app/api/paypal/create-order/route.ts` as needed
- **Razorpay Removal**: Old Razorpay integration has been replaced. Remove any Razorpay webhook configurations if you had them set up
- **Image Storage**: Product images are stored in Supabase Storage under the "products" bucket

## Troubleshooting

- **PayPal buttons not showing**: Check that `NEXT_PUBLIC_PAYPAL_CLIENT_ID` is set correctly
- **Image upload fails**: Verify "products" storage bucket exists and has correct permissions
- **Migration errors**: Ensure you're connected to the correct Supabase project

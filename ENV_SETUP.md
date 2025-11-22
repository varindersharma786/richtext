# Environment Setup

# Environment Setup

Please create a file named `.env.local` in the root directory of the project and add the following environment variables:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
GOOGLE_CLIENT_SECRET=your_google_client_secret

# PayPal Configuration
NEXT_PUBLIC_PAYPAL_CLIENT_ID=your_paypal_client_id
NEXT_PUBLIC_PAYPAL_PLAN_BASIC_MONTHLY=your_basic_monthly_plan_id
NEXT_PUBLIC_PAYPAL_PLAN_BASIC_YEARLY=your_basic_yearly_plan_id
NEXT_PUBLIC_PAYPAL_PLAN_PRO_MONTHLY=your_pro_monthly_plan_id
NEXT_PUBLIC_PAYPAL_PLAN_PRO_YEARLY=your_pro_yearly_plan_id-id
```

You can find these values in your Supabase project settings.

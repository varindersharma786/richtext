-- Migration: Product Enhancements - Multi-image and PayPal Support
-- Date: 2025-01-26
-- Description: Adds support for multiple product images and PayPal payment integration

-- 1. Add image_urls column to products table for multiple images
ALTER TABLE products ADD COLUMN IF NOT EXISTS image_urls text[];

-- 2. Update orders table for PayPal integration
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_provider text DEFAULT 'razorpay';
ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_id text;

-- 3. Migrate existing data (copy razorpay_order_id to payment_id for existing orders)
UPDATE orders 
SET payment_id = razorpay_order_id, 
    payment_provider = 'razorpay' 
WHERE payment_id IS NULL AND razorpay_order_id IS NOT NULL;

-- 4. Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_orders_payment_provider ON orders(payment_provider);
CREATE INDEX IF NOT EXISTS idx_orders_payment_id ON orders(payment_id);

-- 5. Add comment to document the schema change
COMMENT ON COLUMN products.image_urls IS 'Array of image URLs for product gallery (supports multiple images)';
COMMENT ON COLUMN orders.payment_provider IS 'Payment gateway used (paypal, razorpay, etc.)';
COMMENT ON COLUMN orders.payment_id IS 'Payment transaction ID from the payment provider';

-- Note: We keep razorpay_order_id and razorpay_payment_id for backward compatibility
-- These can be removed in a future migration after confirming all data is migrated

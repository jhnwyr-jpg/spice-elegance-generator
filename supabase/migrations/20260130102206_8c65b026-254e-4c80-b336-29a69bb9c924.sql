-- Fix overly permissive RLS policies by adding proper validation

-- Drop the overly permissive public policies and replace with safer versions
DROP POLICY IF EXISTS "Public can insert orders" ON public.orders;
DROP POLICY IF EXISTS "Public can insert customers" ON public.customers;

-- Create safer public order insertion policy (validates required fields are present)
CREATE POLICY "Public can insert orders with validation"
ON public.orders
FOR INSERT
TO anon
WITH CHECK (
  customer_name IS NOT NULL AND 
  phone IS NOT NULL AND 
  address IS NOT NULL AND
  order_id IS NOT NULL
);

-- Create safer public customer insertion policy
CREATE POLICY "Public can insert customers with validation"
ON public.customers
FOR INSERT
TO anon
WITH CHECK (
  name IS NOT NULL AND 
  phone IS NOT NULL
);
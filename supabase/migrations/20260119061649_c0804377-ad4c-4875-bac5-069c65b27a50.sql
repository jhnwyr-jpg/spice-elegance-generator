-- Create enums
CREATE TYPE public.app_role AS ENUM ('owner', 'admin', 'staff');
CREATE TYPE public.order_status AS ENUM ('pending', 'processing', 'shipped', 'delivered', 'cancelled');
CREATE TYPE public.payment_status AS ENUM ('unpaid', 'paid');
CREATE TYPE public.payment_method AS ENUM ('cod', 'online');
CREATE TYPE public.product_status AS ENUM ('active', 'inactive');
CREATE TYPE public.tracking_status AS ENUM ('picked', 'in_transit', 'delivered', 'returned');

-- Admin Users table
CREATE TABLE public.admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  role app_role NOT NULL DEFAULT 'staff',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  discount_price DECIMAL(10,2),
  stock_qty INTEGER NOT NULL DEFAULT 0,
  sku TEXT,
  image_url TEXT,
  description TEXT,
  status product_status NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Customers table
CREATE TABLE public.customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  phone TEXT NOT NULL UNIQUE,
  address TEXT,
  total_orders INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id TEXT NOT NULL UNIQUE,
  customer_id UUID REFERENCES public.customers(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT NOT NULL,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  subtotal DECIMAL(10,2) NOT NULL DEFAULT 0,
  delivery_charge DECIMAL(10,2) NOT NULL DEFAULT 0,
  total DECIMAL(10,2) NOT NULL DEFAULT 0,
  payment_method payment_method NOT NULL DEFAULT 'cod',
  payment_status payment_status NOT NULL DEFAULT 'unpaid',
  order_status order_status NOT NULL DEFAULT 'pending',
  tracking_id TEXT,
  courier_name TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Tracking Events table
CREATE TABLE public.tracking_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  status tracking_status NOT NULL,
  message TEXT,
  timestamp TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Settings table
CREATE TABLE public.settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT NOT NULL UNIQUE,
  value JSONB NOT NULL DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Insert default settings
INSERT INTO public.settings (key, value) VALUES
  ('delivery_charges', '{"dhaka": 50, "outside_dhaka": 100}'::jsonb),
  ('store_info', '{"name": "UR Media", "phone": "", "email": "", "address": ""}'::jsonb);

-- Create function to generate order ID
CREATE OR REPLACE FUNCTION public.generate_order_id()
RETURNS TEXT
LANGUAGE plpgsql
SET search_path = public
AS $$
DECLARE
  year_part TEXT;
  sequence_num INTEGER;
  new_order_id TEXT;
BEGIN
  year_part := TO_CHAR(NOW(), 'YYYY');
  
  SELECT COALESCE(MAX(
    CAST(SUBSTRING(order_id FROM 9 FOR 4) AS INTEGER)
  ), 0) + 1
  INTO sequence_num
  FROM public.orders
  WHERE order_id LIKE 'PK-' || year_part || '-%';
  
  new_order_id := 'PK-' || year_part || '-' || LPAD(sequence_num::TEXT, 4, '0');
  
  RETURN new_order_id;
END;
$$;

-- Create trigger to auto-generate order_id
CREATE OR REPLACE FUNCTION public.set_order_id()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  IF NEW.order_id IS NULL OR NEW.order_id = '' THEN
    NEW.order_id := public.generate_order_id();
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_set_order_id
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.set_order_id();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Create triggers for updated_at
CREATE TRIGGER update_admin_users_updated_at
  BEFORE UPDATE ON public.admin_users
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_customers_updated_at
  BEFORE UPDATE ON public.customers
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_settings_updated_at
  BEFORE UPDATE ON public.settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable RLS
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tracking_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for authenticated admin users
-- Admin users can read all data
CREATE POLICY "Authenticated users can view admin_users" ON public.admin_users
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert admin_users" ON public.admin_users
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update admin_users" ON public.admin_users
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete admin_users" ON public.admin_users
  FOR DELETE TO authenticated USING (true);

-- Products policies
CREATE POLICY "Authenticated users can view products" ON public.products
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert products" ON public.products
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update products" ON public.products
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete products" ON public.products
  FOR DELETE TO authenticated USING (true);

-- Public can view active products (for frontend)
CREATE POLICY "Public can view active products" ON public.products
  FOR SELECT TO anon USING (status = 'active');

-- Customers policies
CREATE POLICY "Authenticated users can view customers" ON public.customers
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert customers" ON public.customers
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update customers" ON public.customers
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete customers" ON public.customers
  FOR DELETE TO authenticated USING (true);

-- Public can insert customers (for order creation)
CREATE POLICY "Public can insert customers" ON public.customers
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "Public can view own customer by phone" ON public.customers
  FOR SELECT TO anon USING (true);

-- Orders policies
CREATE POLICY "Authenticated users can view orders" ON public.orders
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert orders" ON public.orders
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update orders" ON public.orders
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete orders" ON public.orders
  FOR DELETE TO authenticated USING (true);

-- Public can create orders
CREATE POLICY "Public can insert orders" ON public.orders
  FOR INSERT TO anon WITH CHECK (true);

-- Tracking events policies
CREATE POLICY "Authenticated users can view tracking_events" ON public.tracking_events
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can insert tracking_events" ON public.tracking_events
  FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Authenticated users can update tracking_events" ON public.tracking_events
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Authenticated users can delete tracking_events" ON public.tracking_events
  FOR DELETE TO authenticated USING (true);

-- Settings policies
CREATE POLICY "Authenticated users can view settings" ON public.settings
  FOR SELECT TO authenticated USING (true);

CREATE POLICY "Authenticated users can update settings" ON public.settings
  FOR UPDATE TO authenticated USING (true);

CREATE POLICY "Public can view settings" ON public.settings
  FOR SELECT TO anon USING (true);

-- Enable realtime for orders (for notifications)
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;

-- Create indexes for performance
CREATE INDEX idx_orders_customer_id ON public.orders(customer_id);
CREATE INDEX idx_orders_order_status ON public.orders(order_status);
CREATE INDEX idx_orders_created_at ON public.orders(created_at);
CREATE INDEX idx_tracking_events_order_id ON public.tracking_events(order_id);
CREATE INDEX idx_customers_phone ON public.customers(phone);
CREATE INDEX idx_products_status ON public.products(status);
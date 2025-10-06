-- Create app_role enum for user roles
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create user_roles table for secure role management
CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE (user_id, role)
);

-- Enable RLS on user_roles
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- RLS policy for user_roles (users can view their own roles, admins can view all)
CREATE POLICY "Users can view own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id OR public.has_role(auth.uid(), 'admin'));

-- Create order_items table (fixes build errors)
CREATE TABLE public.order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  jersey_id uuid REFERENCES jerseys(id) NOT NULL,
  quantity integer NOT NULL DEFAULT 1,
  size text NOT NULL,
  price numeric NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
ON public.order_items
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
  OR public.has_role(auth.uid(), 'admin')
);

-- Add new columns to orders table for inquiry system
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS inquiry_type text DEFAULT 'jersey_inquiry';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS inquiry_number text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS quoted_price numeric;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS response_time text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS admin_notes text;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS priority_level text DEFAULT 'normal';
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS whatsapp_status text DEFAULT 'not_contacted';

-- Update existing orders RLS policies for admin role check
DROP POLICY IF EXISTS "Admins can manage all orders" ON public.orders;
CREATE POLICY "Admins can manage all orders"
ON public.orders
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Create admin_settings table
CREATE TABLE public.admin_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  whatsapp_business_number text NOT NULL,
  business_hours jsonb NOT NULL DEFAULT '{"monday": {"open": "09:00", "close": "18:00"}, "tuesday": {"open": "09:00", "close": "18:00"}, "wednesday": {"open": "09:00", "close": "18:00"}, "thursday": {"open": "09:00", "close": "18:00"}, "friday": {"open": "09:00", "close": "18:00"}, "saturday": {"open": "10:00", "close": "16:00"}, "sunday": {"closed": true}}'::jsonb,
  message_templates jsonb NOT NULL DEFAULT '{}'::jsonb,
  auto_response_enabled boolean DEFAULT false,
  notification_email text,
  notification_preferences jsonb DEFAULT '{"email": true, "in_app": true}'::jsonb,
  updated_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view admin settings"
ON public.admin_settings
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can manage settings"
ON public.admin_settings
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Insert default admin settings
INSERT INTO public.admin_settings (whatsapp_business_number, notification_email)
VALUES ('2348012345678', 'admin@example.com')
ON CONFLICT DO NOTHING;

-- Add columns to jersey_requests for WhatsApp tracking
ALTER TABLE public.jersey_requests ADD COLUMN IF NOT EXISTS whatsapp_contacted boolean DEFAULT false;
ALTER TABLE public.jersey_requests ADD COLUMN IF NOT EXISTS inquiry_id uuid REFERENCES orders(id);
ALTER TABLE public.jersey_requests ADD COLUMN IF NOT EXISTS last_contacted_at timestamptz;
ALTER TABLE public.jersey_requests ADD COLUMN IF NOT EXISTS admin_response text;

-- Update jersey_requests RLS policies for admin
DROP POLICY IF EXISTS "Admins can update requests" ON public.jersey_requests;
CREATE POLICY "Admins can update requests"
ON public.jersey_requests
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update jerseys RLS policies for admin
DROP POLICY IF EXISTS "Admins can delete jerseys" ON public.jerseys;
DROP POLICY IF EXISTS "Admins can insert jerseys" ON public.jerseys;
DROP POLICY IF EXISTS "Admins can update jerseys" ON public.jerseys;

CREATE POLICY "Admins can delete jerseys"
ON public.jerseys
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert jerseys"
ON public.jerseys
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update jerseys"
ON public.jerseys
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- Update profiles is_admin check (deprecated, use user_roles instead)
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
CREATE POLICY "Users can view all profiles"
ON public.profiles
FOR SELECT
TO authenticated
USING (true);

-- Create trigger to update admin_settings updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_admin_settings_updated_at
BEFORE UPDATE ON public.admin_settings
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
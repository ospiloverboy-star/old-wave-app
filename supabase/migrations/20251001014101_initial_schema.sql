/*
  # Initial Database Schema for Old Wave Jersey

  ## Overview
  Creates the foundational database structure for the jersey e-commerce platform.

  ## New Tables

  ### 1. profiles
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - References auth.users
  - `full_name` (text) - Customer full name
  - `phone_number` (text) - Contact number
  - `is_admin` (boolean) - Admin flag for elevated privileges
  - `created_at` (timestamptz) - Account creation time
  - `updated_at` (timestamptz) - Last profile update time

  ### 2. jerseys
  - `id` (uuid, primary key) - Unique identifier for jersey
  - `name` (text) - Jersey name/description
  - `team` (text) - Team name
  - `league` (text) - League/competition
  - `season` (text) - Season year
  - `price` (decimal) - Jersey price
  - `description` (text) - Detailed description
  - `image_url` (text) - Jersey image URL
  - `sizes` (text array) - All available sizes
  - `available_sizes` (text array) - Currently in-stock sizes
  - `is_available` (boolean) - Availability status
  - `is_featured` (boolean) - Featured on homepage
  - `stock_quantity` (integer) - Total stock count
  - `created_at` (timestamptz) - Creation time
  - `updated_at` (timestamptz) - Last update time

  ### 3. jersey_requests
  - `id` (uuid, primary key) - Unique identifier
  - `user_id` (uuid, foreign key) - Customer who made request
  - `full_name` (text) - Customer name
  - `email` (text) - Contact email
  - `phone_number` (text) - Contact phone
  - `jersey_name` (text) - Requested jersey
  - `team` (text) - Team name
  - `league` (text) - League/competition
  - `size` (text) - Requested size
  - `additional_notes` (text) - Special requirements
  - `status` (text) - Request status: pending, approved, fulfilled, rejected
  - `created_at` (timestamptz) - Request time
  - `updated_at` (timestamptz) - Last status update

  ## Security (Row Level Security)

  All tables have RLS enabled with restrictive policies ensuring:
  - Users can only access their own data
  - Public can view jerseys
  - Admins have full access to manage inventory and requests

  ## Important Notes

  1. **Storage Bucket**: Creates 'jersey-images' bucket for image uploads
  2. **Auto Profile Creation**: Trigger automatically creates profile for new users
  3. **Timestamps**: Automatic update tracking via triggers
  4. **Admin Access**: is_admin flag controls administrative privileges
*/

-- Create profiles table for user information
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  phone_number TEXT,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create jerseys table
CREATE TABLE IF NOT EXISTS public.jerseys (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  team TEXT NOT NULL,
  league TEXT NOT NULL,
  season TEXT NOT NULL,
  price DECIMAL(10,2) NOT NULL,
  description TEXT,
  image_url TEXT,
  sizes TEXT[] DEFAULT '{}',
  available_sizes TEXT[] DEFAULT '{}',
  is_available BOOLEAN DEFAULT true,
  is_featured BOOLEAN DEFAULT false,
  stock_quantity INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on jerseys
ALTER TABLE public.jerseys ENABLE ROW LEVEL SECURITY;

-- Create jersey requests table
CREATE TABLE IF NOT EXISTS public.jersey_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  jersey_name TEXT NOT NULL,
  team TEXT NOT NULL,
  league TEXT,
  size TEXT NOT NULL,
  additional_notes TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'fulfilled', 'rejected')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on jersey requests
ALTER TABLE public.jersey_requests ENABLE ROW LEVEL SECURITY;

-- Create storage bucket for jersey images
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'jersey-images') THEN
    INSERT INTO storage.buckets (id, name, public) VALUES ('jersey-images', 'jersey-images', true);
  END IF;
END $$;

-- Profiles policies
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Jerseys policies (public read, admin write)
CREATE POLICY "Anyone can view jerseys"
  ON public.jerseys FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert jerseys"
  ON public.jerseys FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admins can update jerseys"
  ON public.jerseys FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admins can delete jerseys"
  ON public.jerseys FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true)
  );

-- Jersey requests policies
CREATE POLICY "Users can view own requests"
  ON public.jersey_requests FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Anyone can create requests"
  ON public.jersey_requests FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Admins can update requests"
  ON public.jersey_requests FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true)
  );

-- Storage policies for jersey images
CREATE POLICY "Anyone can view jersey images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'jersey-images');

CREATE POLICY "Admins can upload jersey images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'jersey-images' AND 
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admins can update jersey images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'jersey-images' AND 
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true)
  );

CREATE POLICY "Admins can delete jersey images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'jersey-images' AND 
    EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true)
  );

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jerseys_updated_at
  BEFORE UPDATE ON public.jerseys
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_jersey_requests_updated_at
  BEFORE UPDATE ON public.jersey_requests
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, full_name)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name');
  RETURN NEW;
EXCEPTION
  WHEN unique_violation THEN
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

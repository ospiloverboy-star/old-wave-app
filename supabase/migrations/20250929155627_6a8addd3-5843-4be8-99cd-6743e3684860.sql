-- Create profiles table for user information
CREATE TABLE public.profiles (
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
CREATE TABLE public.jerseys (
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
CREATE TABLE public.jersey_requests (
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
INSERT INTO storage.buckets (id, name, public) VALUES ('jersey-images', 'jersey-images', true);

-- Profiles policies
CREATE POLICY "Users can view all profiles" ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Jerseys policies (public read, admin write)
CREATE POLICY "Anyone can view jerseys" ON public.jerseys FOR SELECT USING (true);
CREATE POLICY "Admins can insert jerseys" ON public.jerseys FOR INSERT WITH CHECK (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can update jerseys" ON public.jerseys FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can delete jerseys" ON public.jerseys FOR DELETE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true)
);

-- Jersey requests policies
CREATE POLICY "Users can view own requests" ON public.jersey_requests FOR SELECT USING (
  auth.uid() = user_id OR EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Anyone can create requests" ON public.jersey_requests FOR INSERT WITH CHECK (true);
CREATE POLICY "Admins can update requests" ON public.jersey_requests FOR UPDATE USING (
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true)
);

-- Storage policies for jersey images
CREATE POLICY "Anyone can view jersey images" ON storage.objects FOR SELECT USING (bucket_id = 'jersey-images');
CREATE POLICY "Admins can upload jersey images" ON storage.objects FOR INSERT WITH CHECK (
  bucket_id = 'jersey-images' AND 
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can update jersey images" ON storage.objects FOR UPDATE USING (
  bucket_id = 'jersey-images' AND 
  EXISTS (SELECT 1 FROM public.profiles WHERE user_id = auth.uid() AND is_admin = true)
);
CREATE POLICY "Admins can delete jersey images" ON storage.objects FOR DELETE USING (
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
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Create trigger for new user profile creation
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add photo_url to rooms
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS photo_url text;

-- Create storage bucket for room photos
INSERT INTO storage.buckets (id, name, public) VALUES ('room-photos', 'room-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: anyone can view room photos
CREATE POLICY "Anyone can view room photos" ON storage.objects FOR SELECT USING (bucket_id = 'room-photos');

-- Storage RLS: superadmins can manage room photos
CREATE POLICY "Superadmins can upload room photos" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'room-photos' AND public.has_role(auth.uid(), 'superadmin'));
CREATE POLICY "Superadmins can update room photos" ON storage.objects FOR UPDATE USING (bucket_id = 'room-photos' AND public.has_role(auth.uid(), 'superadmin'));
CREATE POLICY "Superadmins can delete room photos" ON storage.objects FOR DELETE USING (bucket_id = 'room-photos' AND public.has_role(auth.uid(), 'superadmin'));

-- Add DELETE policy for profiles so superadmins can delete users
CREATE POLICY "Superadmins can delete profiles" ON public.profiles FOR DELETE USING (public.has_role(auth.uid(), 'superadmin'));

-- Add UPDATE policy for superadmins to edit any profile
CREATE POLICY "Superadmins can update all profiles" ON public.profiles FOR UPDATE USING (public.has_role(auth.uid(), 'superadmin'));

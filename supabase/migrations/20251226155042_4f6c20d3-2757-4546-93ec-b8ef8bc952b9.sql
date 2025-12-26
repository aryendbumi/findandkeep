-- Reduce profile PII exposure by splitting the internal directory into a separate table
-- and tightening profiles SELECT access.

-- 1) Directory table (no email)
CREATE TABLE IF NOT EXISTS public.profile_directory (
  id uuid PRIMARY KEY,
  first_name text,
  last_name text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.profile_directory ENABLE ROW LEVEL SECURITY;

-- Policies (directory is readable to signed-in users; writable only by superadmins)
DROP POLICY IF EXISTS "Authenticated users can view profile directory" ON public.profile_directory;
CREATE POLICY "Authenticated users can view profile directory"
ON public.profile_directory
FOR SELECT
USING (auth.uid() IS NOT NULL);

DROP POLICY IF EXISTS "Superadmins can manage profile directory" ON public.profile_directory;
CREATE POLICY "Superadmins can manage profile directory"
ON public.profile_directory
FOR ALL
USING (has_role(auth.uid(), 'superadmin'::app_role))
WITH CHECK (has_role(auth.uid(), 'superadmin'::app_role));

-- Keep updated_at current
DROP TRIGGER IF EXISTS update_profile_directory_updated_at ON public.profile_directory;
CREATE TRIGGER update_profile_directory_updated_at
BEFORE UPDATE ON public.profile_directory
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- 2) Sync directory table from profiles (runs server-side)
CREATE OR REPLACE FUNCTION public.sync_profile_directory()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    DELETE FROM public.profile_directory WHERE id = OLD.id;
    RETURN OLD;
  END IF;

  INSERT INTO public.profile_directory (id, first_name, last_name)
  VALUES (NEW.id, NEW.first_name, NEW.last_name)
  ON CONFLICT (id) DO UPDATE
    SET first_name = EXCLUDED.first_name,
        last_name = EXCLUDED.last_name,
        updated_at = now();

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS profiles_sync_directory_insert ON public.profiles;
CREATE TRIGGER profiles_sync_directory_insert
AFTER INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.sync_profile_directory();

DROP TRIGGER IF EXISTS profiles_sync_directory_update ON public.profiles;
CREATE TRIGGER profiles_sync_directory_update
AFTER UPDATE OF first_name, last_name ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.sync_profile_directory();

DROP TRIGGER IF EXISTS profiles_sync_directory_delete ON public.profiles;
CREATE TRIGGER profiles_sync_directory_delete
AFTER DELETE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.sync_profile_directory();

-- Backfill existing rows
INSERT INTO public.profile_directory (id, first_name, last_name)
SELECT id, first_name, last_name
FROM public.profiles
ON CONFLICT (id) DO UPDATE
  SET first_name = EXCLUDED.first_name,
      last_name = EXCLUDED.last_name,
      updated_at = now();

-- 3) Tighten profiles SELECT policies (emails no longer broadly readable)
DROP POLICY IF EXISTS "Users can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view own profile" ON public.profiles;
DROP POLICY IF EXISTS "Superadmins can view all profiles" ON public.profiles;

CREATE POLICY "Users can view own profile"
ON public.profiles
FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Superadmins can view all profiles"
ON public.profiles
FOR SELECT
USING (has_role(auth.uid(), 'superadmin'::app_role));

-- Add constraint to ensure end_time is after start_time using a trigger
-- (Using trigger instead of CHECK constraint to avoid immutability issues)

-- Create validation function for booking time
CREATE OR REPLACE FUNCTION public.validate_booking_time()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate end_time is after start_time
  IF NEW.end_time <= NEW.start_time THEN
    RAISE EXCEPTION 'End time must be after start time';
  END IF;
  
  -- Check for overlapping bookings in the same room
  IF EXISTS (
    SELECT 1 FROM public.bookings
    WHERE room_id = NEW.room_id
    AND id != COALESCE(NEW.id, '00000000-0000-0000-0000-000000000000'::uuid)
    AND (NEW.start_time, NEW.end_time) OVERLAPS (start_time, end_time)
  ) THEN
    RAISE EXCEPTION 'Booking conflicts with an existing reservation';
  END IF;
  
  RETURN NEW;
END;
$$;

-- Create trigger for INSERT
CREATE TRIGGER validate_booking_time_insert
BEFORE INSERT ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.validate_booking_time();

-- Create trigger for UPDATE
CREATE TRIGGER validate_booking_time_update
BEFORE UPDATE ON public.bookings
FOR EACH ROW
EXECUTE FUNCTION public.validate_booking_time();
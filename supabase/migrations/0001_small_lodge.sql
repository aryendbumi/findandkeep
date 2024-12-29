/*
  # Fix Booking Priority Constraint

  1. Changes
    - Update bookings table priority constraint to accept 'high', 'medium', 'low'
    - Add check constraint for valid priority values
*/

DO $$ BEGIN
  -- Drop existing check constraint if it exists
  ALTER TABLE bookings DROP CONSTRAINT IF EXISTS bookings_priority_check;
  
  -- Add new check constraint
  ALTER TABLE bookings 
    ADD CONSTRAINT bookings_priority_check 
    CHECK (priority IN ('high', 'medium', 'low'));

END $$;
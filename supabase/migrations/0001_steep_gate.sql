/*
  # Add Profiles Relationship to Bookings

  1. Changes
    - Add foreign key constraint between bookings and profiles tables
    - Add index on user_id for better query performance

  2. Security
    - No changes to RLS policies needed
*/

-- Add foreign key constraint
ALTER TABLE bookings 
ADD CONSTRAINT bookings_user_id_fkey 
FOREIGN KEY (user_id) 
REFERENCES profiles(id)
ON DELETE CASCADE;

-- Add index for better performance
CREATE INDEX IF NOT EXISTS bookings_user_id_idx ON bookings(user_id);
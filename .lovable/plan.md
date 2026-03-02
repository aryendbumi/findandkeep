

# Superadmin Full Control Features

## Overview
Enhance the superadmin role with full CRUD capabilities across users, rooms (with photo uploads and detailed amenities), and the ability to manage/overwrite any organizer's bookings. Also fix the existing edge function build errors.

## What will be built

### 1. Fix Edge Function Build Errors
The `booking-assistant` edge function has TypeScript errors due to untyped Supabase client. Fix by adding explicit type annotations and using `as any` casts for the Supabase client in the edge function context.

### 2. Room Photos and Amenities Details
- Add a `photo_url` column to the `rooms` table (nullable text)
- Create a `room-photos` storage bucket (public) for uploading room images
- Update the Room Form to include a photo upload field and richer amenities input
- Display room photos in the Room Management list and on room cards

### 3. Superadmin Booking Management
- Create a new "Booking Management" page (superadmin-only) that lists ALL bookings from all users
- Superadmin can edit or delete any booking (overwrite organizer requests)
- Add navigation link visible only to superadmins
- Reuse existing RLS policy ("Superadmins can manage all bookings") which already grants full access

### 4. Superadmin User CRUD Enhancements
- The existing User Management page already shows users and lets superadmin change roles
- Add ability to delete users (remove from profiles, which cascades)
- Add ability to edit user details (first name, last name)

---

## Technical Details

### Database Migration
```sql
-- Add photo_url to rooms
ALTER TABLE public.rooms ADD COLUMN IF NOT EXISTS photo_url text;

-- Create storage bucket for room photos
INSERT INTO storage.buckets (id, name, public) VALUES ('room-photos', 'room-photos', true);

-- Storage RLS: anyone can view, superadmins can upload/delete
CREATE POLICY "Anyone can view room photos" ON storage.objects FOR SELECT USING (bucket_id = 'room-photos');
CREATE POLICY "Superadmins can manage room photos" ON storage.objects FOR ALL USING (bucket_id = 'room-photos' AND public.has_role(auth.uid(), 'superadmin'));
```

### Files to Create
- `src/pages/BookingManagement.tsx` -- Superadmin page to view/edit/delete all bookings

### Files to Modify
- `supabase/functions/booking-assistant/index.ts` -- Fix TS build errors (add type casts)
- `src/components/rooms/RoomForm.tsx` -- Add photo upload field
- `src/components/rooms/RoomList.tsx` -- Show room photos
- `src/components/rooms/RoomDialog.tsx` -- Handle photo upload flow
- `src/hooks/useRoomOperations.ts` -- Handle photo upload to storage
- `src/pages/RoomManagement.tsx` -- Minor updates for photo support
- `src/pages/UserManagement.tsx` -- Add edit/delete user capabilities
- `src/components/AppContent.tsx` -- Add Booking Management route and nav link
- `src/components/RoomCard.tsx` -- Display room photo from storage

### Edge Function Fix
Replace the untyped `createClient` usage with explicit `any` type annotation to resolve the 3 TS errors:
- Cast supabase client as `any` in `handleToolCall` parameter
- Or use `createClient<any>()` to avoid strict type checking in edge function context


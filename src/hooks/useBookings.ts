
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Booking } from "@/types/booking";

export function useBookings() {
  return useQuery({
    queryKey: ["all-bookings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          rooms(name),
          profiles:user_id(
            first_name,
            last_name,
            email
          )
        `)
        .order('start_time', { ascending: false });

      if (error) throw error;

      return data.map(booking => ({
        ...booking,
        roomName: booking.rooms?.name,
        date: new Date(booking.start_time).toLocaleDateString(),
        startTime: new Date(booking.start_time).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: false 
        }),
        endTime: new Date(booking.end_time).toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: false 
        }),
        organizer: booking.profiles && booking.profiles.first_name 
          ? `${booking.profiles.first_name} ${booking.profiles.last_name || ''}`
          : booking.profiles?.email || 'Unknown'
      })) as Booking[];
    }
  });
}

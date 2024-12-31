import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useRoomBookings(roomId: number, date?: Date) {
  return useQuery({
    queryKey: ["room-bookings", roomId, date],
    queryFn: async () => {
      if (!date) return [];

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from("bookings")
        .select(`
          id,
          title,
          start_time,
          end_time,
          user:user_id (
            first_name,
            last_name,
            email
          )
        `)
        .eq("room_id", roomId)
        .gte("start_time", startOfDay.toISOString())
        .lte("end_time", endOfDay.toISOString());

      if (error) throw error;

      return data.map(booking => ({
        ...booking,
        start: new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        end: new Date(booking.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        eventName: booking.title,
        bookedBy: booking.user?.first_name 
          ? `${booking.user.first_name} ${booking.user.last_name || ''}`
          : booking.user?.email
      }));
    },
    enabled: !!roomId && !!date
  });
}
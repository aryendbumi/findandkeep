import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useRoomBookings(roomId: number, date?: Date) {
  return useQuery({
    queryKey: ["room-bookings", roomId, date?.toISOString()],
    queryFn: async () => {
      if (!date) return [];

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .eq("room_id", roomId)
        .gte("start_time", startOfDay.toISOString())
        .lte("end_time", endOfDay.toISOString())
        .order("start_time");

      if (error) throw error;

      // Fetch profiles separately
      const userIds = [...new Set(data.map(b => b.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("id, first_name, last_name, email")
        .in("id", userIds);

      const profileMap = new Map(profiles?.map(p => [p.id, p]) || []);

      return data.map(booking => {
        const profile = profileMap.get(booking.user_id);
        return {
          ...booking,
          start: new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          end: new Date(booking.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          eventName: booking.title,
          bookedBy: profile 
            ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || profile.email
            : 'Unknown'
        };
      });
    },
    enabled: !!roomId && !!date
  });
}

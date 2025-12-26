import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useRoomBookings(roomId?: number, date?: Date | string) {
  return useQuery({
    queryKey: ["room-bookings", roomId, typeof date === 'string' ? date : date?.toISOString()],
    queryFn: async () => {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (!dateObj) return [];

      const startOfDay = new Date(dateObj);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(dateObj);
      endOfDay.setHours(23, 59, 59, 999);

      let query = supabase
        .from("bookings")
        .select("*")
        .gte("start_time", startOfDay.toISOString())
        .lte("end_time", endOfDay.toISOString())
        .order("start_time");

      if (roomId) {
        query = query.eq("room_id", roomId);
      }

      const { data, error } = await query;

      if (error) throw error;

      // Fetch profile directory (names only, no PII) for display
      const userIds = [...new Set(data.map(b => b.user_id))];
      const { data: directory } = await supabase
        .from("profile_directory")
        .select("id, first_name, last_name")
        .in("id", userIds);

      // Fetch rooms separately
      const roomIds = [...new Set(data.map(b => b.room_id))];
      const { data: rooms } = await supabase
        .from("rooms")
        .select("id, name")
        .in("id", roomIds);

      const directoryMap = new Map(directory?.map(p => [p.id, p]) || []);
      const roomMap = new Map(rooms?.map(r => [r.id, r]) || []);

      return data.map(booking => {
        const dirEntry = directoryMap.get(booking.user_id);
        const room = roomMap.get(booking.room_id);
        return {
          ...booking,
          roomName: room?.name || 'Unknown Room',
          start: new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          end: new Date(booking.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          eventName: booking.title,
          bookedBy: dirEntry 
            ? `${dirEntry.first_name || ''} ${dirEntry.last_name || ''}`.trim() || 'Unknown'
            : 'Unknown'
        };
      });
    },
    enabled: !!date
  });
}

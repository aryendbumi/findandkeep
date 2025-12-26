import { useQuery, useQueryClient } from "@tanstack/react-query";
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
          rooms (name)
        `)
        .order("start_time", { ascending: false });

      if (error) throw error;

      // Fetch profile directory (names only, no PII) for display
      const userIds = [...new Set(data.map(b => b.user_id))];
      const { data: directory } = await supabase
        .from("profile_directory")
        .select("id, first_name, last_name")
        .in("id", userIds);

      const directoryMap = new Map(directory?.map(p => [p.id, p]) || []);

      return data.map(booking => {
        const dirEntry = directoryMap.get(booking.user_id);
        return {
          ...booking,
          roomName: booking.rooms?.name || "Unknown Room",
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
          organizer: dirEntry 
            ? `${dirEntry.first_name || ''} ${dirEntry.last_name || ''}`.trim() || 'Unknown'
            : 'Unknown',
          profiles: dirEntry ? { first_name: dirEntry.first_name, last_name: dirEntry.last_name, email: '' } : null,
        };
      }) as Booking[];
    }
  });
}

export function useMyBookings(userId: string | undefined) {
  return useQuery({
    queryKey: ["my-bookings", userId],
    queryFn: async () => {
      if (!userId) return [];
      
      const { data, error } = await supabase
        .from("bookings")
        .select(`
          *,
          rooms (name)
        `)
        .eq("user_id", userId)
        .order("start_time", { ascending: false });

      if (error) throw error;

      const { data: dirEntry } = await supabase
        .from("profile_directory")
        .select("id, first_name, last_name")
        .eq("id", userId)
        .maybeSingle();

      return data.map(booking => ({
        ...booking,
        roomName: booking.rooms?.name || "Unknown Room",
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
        organizer: dirEntry 
          ? `${dirEntry.first_name || ''} ${dirEntry.last_name || ''}`.trim() || 'Unknown'
          : 'Unknown',
        profiles: dirEntry ? { first_name: dirEntry.first_name, last_name: dirEntry.last_name, email: '' } : null,
      })) as Booking[];
    },
    enabled: !!userId,
  });
}

export function useRefreshBookings() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["all-bookings"] });
    queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
    queryClient.invalidateQueries({ queryKey: ["room-bookings"] });
  };
}

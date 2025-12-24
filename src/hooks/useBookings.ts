import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getBookings, getRooms, LocalBooking } from "@/data/mockData";
import type { Booking } from "@/types/booking";

export function useBookings() {
  return useQuery({
    queryKey: ["all-bookings"],
    queryFn: async () => {
      const bookings = getBookings();
      const rooms = getRooms();

      return bookings.map(booking => {
        const room = rooms.find(r => r.id === booking.room_id);
        return {
          ...booking,
          roomName: room?.name || "Unknown Room",
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
          organizer: booking.user_name || booking.user_email || 'Unknown',
          profiles: {
            first_name: booking.user_name?.split(' ')[0] || null,
            last_name: booking.user_name?.split(' ')[1] || null,
            email: booking.user_email,
          }
        };
      }) as Booking[];
    }
  });
}

export function useRefreshBookings() {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: ["all-bookings"] });
}

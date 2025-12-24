import { useQuery } from "@tanstack/react-query";
import { getBookings } from "@/data/mockData";

export function useRoomBookings(roomId: number, date?: Date) {
  return useQuery({
    queryKey: ["room-bookings", roomId, date],
    queryFn: async () => {
      if (!date) return [];

      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const bookings = getBookings();
      
      return bookings
        .filter(booking => {
          const bookingStart = new Date(booking.start_time);
          const bookingEnd = new Date(booking.end_time);
          return (
            booking.room_id === roomId &&
            bookingStart >= startOfDay &&
            bookingEnd <= endOfDay
          );
        })
        .map(booking => ({
          ...booking,
          start: new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          end: new Date(booking.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          eventName: booking.title,
          bookedBy: booking.user_name || booking.user_email || 'Unknown'
        }));
    },
    enabled: !!roomId && !!date
  });
}

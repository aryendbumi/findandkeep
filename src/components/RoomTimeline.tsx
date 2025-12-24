import { useState } from "react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import TimelineHeader from "./TimelineHeader";
import TimelineGrid from "./timeline/TimelineGrid";
import TimelineLegend from "./timeline/TimelineLegend";
import MobileTimelineView from "./timeline/MobileTimelineView";
import { useIsMobile } from "@/hooks/use-mobile";
import { getRooms, getBookings } from "@/data/mockData";
import { useQuery } from "@tanstack/react-query";

const timeSlots = Array.from({ length: 15 }, (_, i) => {
  const hour = i + 7;
  return `${hour.toString().padStart(2, "0")}:00`;
});

const RoomTimeline = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [isExpanded, setIsExpanded] = useState(true);
  const isMobile = useIsMobile();

  const { data: rooms = [] } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => getRooms()
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ["bookings", date],
    queryFn: async () => {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const allBookings = getBookings();

      return allBookings
        .filter(booking => {
          const bookingStart = new Date(booking.start_time);
          const bookingEnd = new Date(booking.end_time);
          return bookingStart >= startOfDay && bookingEnd <= endOfDay;
        })
        .map(booking => ({
          ...booking,
          roomId: booking.room_id,
          startTime: new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          endTime: new Date(booking.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          organizer: booking.user_name || booking.user_email || 'Unknown'
        }));
    }
  });

  return (
    <Card className={cn("p-4", !isExpanded && "pb-0")}>
      <TimelineHeader
        date={date}
        onDateChange={setDate}
        isExpanded={isExpanded}
        onExpandToggle={() => setIsExpanded(!isExpanded)}
      />

      {isExpanded && (
        <div className="space-y-4">
          {isMobile ? (
            <MobileTimelineView rooms={rooms} bookings={bookings} />
          ) : (
            <TimelineGrid
              rooms={rooms}
              bookings={bookings}
              timeSlots={timeSlots}
            />
          )}
          <TimelineLegend />
        </div>
      )}
    </Card>
  );
};

export default RoomTimeline;

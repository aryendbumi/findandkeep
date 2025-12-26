import { useState } from "react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import TimelineHeader from "./TimelineHeader";
import TimelineGrid from "./timeline/TimelineGrid";
import TimelineLegend from "./timeline/TimelineLegend";
import MobileTimelineView from "./timeline/MobileTimelineView";
import { useIsMobile } from "@/hooks/use-mobile";
import { useRooms } from "@/hooks/useRooms";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const timeSlots = Array.from({ length: 15 }, (_, i) => {
  const hour = i + 7;
  return `${hour.toString().padStart(2, "0")}:00`;
});

const RoomTimeline = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [isExpanded, setIsExpanded] = useState(true);
  const isMobile = useIsMobile();

  const { data: rooms = [] } = useRooms();

  const { data: bookings = [] } = useQuery({
    queryKey: ["timeline-bookings", date.toISOString()],
    queryFn: async () => {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .gte("start_time", startOfDay.toISOString())
        .lte("end_time", endOfDay.toISOString());

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
          roomId: booking.room_id,
          startTime: new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          endTime: new Date(booking.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
          organizer: dirEntry 
            ? `${dirEntry.first_name || ''} ${dirEntry.last_name || ''}`.trim() || 'Unknown'
            : 'Unknown'
        };
      });
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

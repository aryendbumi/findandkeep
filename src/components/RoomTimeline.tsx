import { useState } from "react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import TimelineHeader from "./TimelineHeader";
import TimelineGrid from "./timeline/TimelineGrid";
import TimelineLegend from "./timeline/TimelineLegend";
import MobileTimelineView from "./timeline/MobileTimelineView";
import { useIsMobile } from "@/hooks/use-mobile";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";

const timeSlots = Array.from({ length: 15 }, (_, i) => {
  const hour = i + 7; // Start from 07:00
  return `${hour.toString().padStart(2, "0")}:00`;
});

const RoomTimeline = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [isExpanded, setIsExpanded] = useState(true);
  const isMobile = useIsMobile();

  const { data: rooms = [] } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    }
  });

  const { data: bookings = [] } = useQuery({
    queryKey: ["bookings", date],
    queryFn: async () => {
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const { data, error } = await supabase
        .from("bookings")
        .select(`
          id,
          room_id,
          start_time,
          end_time,
          title,
          attendees,
          type,
          zoom_required,
          priority,
          user:user_id (
            first_name,
            last_name,
            email
          )
        `)
        .gte("start_time", startOfDay.toISOString())
        .lte("end_time", endOfDay.toISOString());

      if (error) throw error;

      return data.map(booking => ({
        ...booking,
        startTime: new Date(booking.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        endTime: new Date(booking.end_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
        organizer: booking.user?.first_name 
          ? `${booking.user.first_name} ${booking.user.last_name || ''}`
          : booking.user?.email
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
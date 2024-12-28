import { useState } from "react";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import TimelineHeader from "./TimelineHeader";
import TimelineGrid from "./timeline/TimelineGrid";
import TimelineLegend from "./timeline/TimelineLegend";
import MobileTimelineView from "./timeline/MobileTimelineView";
import { useIsMobile } from "@/hooks/use-mobile";

const bookings = [
  {
    id: 1,
    roomId: 1,
    startTime: "09:00",
    endTime: "10:30",
    title: "Q4 Review",
    organizer: "John Doe",
    attendees: 8,
    type: "Internal",
    zoomRequired: true,
    priority: "high",
  },
  {
    id: 2,
    roomId: 2,
    startTime: "14:00",
    endTime: "15:00",
    title: "Team Sync",
    organizer: "Jane Smith",
    attendees: 4,
    type: "Internal",
    zoomRequired: false,
    priority: "medium",
  },
  {
    id: 3,
    roomId: 3,
    startTime: "11:00",
    endTime: "12:00",
    title: "Client Meeting",
    organizer: "Mike Johnson",
    attendees: 10,
    type: "External",
    zoomRequired: true,
    priority: "high",
  },
  {
    id: 4,
    roomId: 1,
    startTime: "13:00",
    endTime: "14:30",
    title: "2025 Planning",
    organizer: "Sarah Wilson",
    attendees: 12,
    type: "Internal",
    zoomRequired: true,
    priority: "high",
  },
  {
    id: 5,
    roomId: 4,
    startTime: "15:00",
    endTime: "16:00",
    title: "Department Update",
    organizer: "Tom Brown",
    attendees: 3,
    type: "Internal",
    zoomRequired: false,
    priority: "low",
  },
  {
    id: 6,
    roomId: 5,
    startTime: "08:00",
    endTime: "09:00",
    title: "Daily Standup",
    organizer: "Alex Green",
    attendees: 6,
    type: "Internal",
    zoomRequired: true,
    priority: "medium",
  },
];

const rooms = [
  { id: 1, name: "Productivity Room", capacity: 16 },
  { id: 2, name: "Availability Room", capacity: 8 },
  { id: 3, name: "Efficiency Room", capacity: 12 },
  { id: 4, name: "Utilization Room", capacity: 6 },
  { id: 5, name: "TAT Meeting Room", capacity: 10 },
];

const timeSlots = Array.from({ length: 15 }, (_, i) => {
  const hour = i + 7; // Start from 07:00
  return `${hour.toString().padStart(2, "0")}:00`;
});

const RoomTimeline = () => {
  const [date, setDate] = useState<Date>(new Date());
  const [isExpanded, setIsExpanded] = useState(true);
  const isMobile = useIsMobile();

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

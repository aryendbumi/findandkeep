import { useState } from "react";
import { Card } from "./ui/card";
import { Users, Video } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { cn } from "@/lib/utils";
import TimelineHeader from "./TimelineHeader";

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

  const getBookingPosition = (startTime: string) => {
    const [hours] = startTime.split(":").map(Number);
    return ((hours - 7) / 14) * 100;
  };

  const getBookingWidth = (startTime: string, endTime: string) => {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);
    const duration = (endHours + endMinutes / 60) - (startHours + startMinutes / 60);
    return (duration / 14) * 100;
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-[#ea384c]";
      case "medium":
        return "bg-[#F97316]";
      case "low":
        return "bg-[#33C3F0]";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="p-4">
      <TimelineHeader
        date={date}
        onDateChange={setDate}
        isExpanded={isExpanded}
        onExpandToggle={() => setIsExpanded(!isExpanded)}
      />

      {isExpanded && (
        <div className="space-y-4 transition-all duration-300">
          <div className="flex">
            <div className="w-48 flex-shrink-0"></div>
            <div className="flex-1 flex border-b">
              {timeSlots.map((time) => (
                <div
                  key={time}
                  className="flex-1 text-xs text-gray-500 text-center border-l border-gray-200 pb-2"
                >
                  {time}
                </div>
              ))}
            </div>
          </div>

          {rooms.map((room) => (
            <div key={room.id} className="flex mb-4 relative group">
              <div className="w-48 flex-shrink-0 pr-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium">{room.name}</p>
                  <p className="text-xs text-muted-foreground">
                    Capacity: {room.capacity} people
                  </p>
                </div>
              </div>
              <div className="flex-1 h-12 bg-gray-50 relative border rounded-md group-hover:bg-gray-100 transition-colors">
                {/* Available slots indicator */}
                <div className="absolute inset-0 flex items-center justify-center text-xs text-gray-400">
                  Available
                </div>
                
                {bookings
                  .filter((booking) => booking.roomId === room.id)
                  .map((booking) => (
                    <TooltipProvider key={booking.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div
                            className={cn(
                              "absolute h-full rounded-md shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-[1px] cursor-pointer",
                              getPriorityColor(booking.priority)
                            )}
                            style={{
                              left: `${getBookingPosition(booking.startTime)}%`,
                              width: `${getBookingWidth(
                                booking.startTime,
                                booking.endTime
                              )}%`,
                            }}
                          >
                            <div className="px-2 py-1 text-xs text-white truncate">
                              {booking.title}
                            </div>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="p-0">
                          <div className="p-3 space-y-2">
                            <p className="font-medium">{booking.title}</p>
                            <div className="space-y-1 text-sm">
                              <p>Time: {booking.startTime} - {booking.endTime}</p>
                              <p>Organizer: {booking.organizer}</p>
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span>
                                  {booking.attendees}/{room.capacity} attendees
                                </span>
                              </div>
                              <p>Type: {booking.type}</p>
                              {booking.zoomRequired && (
                                <div className="flex items-center gap-1 text-blue-500">
                                  <Video className="h-3 w-3" />
                                  <span>Zoom Required</span>
                                </div>
                              )}
                              <p className="text-xs mt-2">
                                Priority:{" "}
                                <span
                                  className={cn(
                                    "px-2 py-0.5 rounded-full text-white",
                                    getPriorityColor(booking.priority)
                                  )}
                                >
                                  {booking.priority}
                                </span>
                              </p>
                            </div>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
              </div>
            </div>
          ))}

          <div className="flex justify-end pt-4 border-t">
            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#ea384c]"></div>
                <span className="text-xs">High Priority</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#F97316]"></div>
                <span className="text-xs">Medium Priority</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-[#33C3F0]"></div>
                <span className="text-xs">Low Priority</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
};

export default RoomTimeline;

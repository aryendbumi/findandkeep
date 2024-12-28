import { Users, Video } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { cn } from "@/lib/utils";

interface TimelineGridProps {
  rooms: any[];
  bookings: any[];
  timeSlots: string[];
}

const TimelineGrid = ({ rooms, bookings, timeSlots }: TimelineGridProps) => {
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
    <div className="space-y-4 transition-all duration-300 overflow-x-auto pb-4">
      <div className="flex min-w-[800px]">
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
        <div key={room.id} className="flex mb-4 relative group min-w-[800px]">
          <div className="w-48 flex-shrink-0 pr-4">
            <div className="space-y-1">
              <p className="text-sm font-medium">{room.name}</p>
              <p className="text-xs text-muted-foreground">
                Capacity: {room.capacity} people
              </p>
            </div>
          </div>
          <div className="flex-1 h-12 bg-gray-50 relative border rounded-md group-hover:bg-gray-100 transition-colors">
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
    </div>
  );
};

export default TimelineGrid;
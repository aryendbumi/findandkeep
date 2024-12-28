import { Users, Video } from "lucide-react";
import { cn } from "@/lib/utils";

interface MobileTimelineViewProps {
  rooms: any[];
  bookings: any[];
}

const MobileTimelineView = ({ rooms, bookings }: MobileTimelineViewProps) => {
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
    <div className="space-y-6">
      {rooms.map((room) => {
        const roomBookings = bookings.filter((booking) => booking.roomId === room.id);
        
        return (
          <div key={room.id} className="border rounded-lg p-4 space-y-4">
            <div className="space-y-1">
              <h3 className="font-medium">{room.name}</h3>
              <p className="text-sm text-muted-foreground">
                Capacity: {room.capacity} people
              </p>
            </div>

            {roomBookings.length > 0 ? (
              <div className="space-y-3">
                {roomBookings.map((booking) => (
                  <div
                    key={booking.id}
                    className={cn(
                      "p-3 rounded-md text-white",
                      getPriorityColor(booking.priority)
                    )}
                  >
                    <div className="font-medium">{booking.title}</div>
                    <div className="text-sm opacity-90">
                      {booking.startTime} - {booking.endTime}
                    </div>
                    <div className="mt-2 flex items-center gap-4 text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="h-4 w-4" />
                        <span>{booking.attendees}</span>
                      </div>
                      {booking.zoomRequired && (
                        <div className="flex items-center gap-1">
                          <Video className="h-4 w-4" />
                          <span>Zoom</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-sm text-muted-foreground">
                No bookings
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default MobileTimelineView;
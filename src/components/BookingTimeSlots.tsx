import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";

interface TimeSlot {
  start: string;
  end: string;
  duration: string;
  isBooked: boolean;
  bookedBy?: string;
  eventName?: string;
}

interface BookingTimeSlotsProps {
  roomName: string;
  date: Date | undefined;
  timeSlots: TimeSlot[];
}

export function BookingTimeSlots({ roomName, date, timeSlots }: BookingTimeSlotsProps) {
  if (!date) return null;

  const availableSlots = timeSlots.filter(slot => !slot.isBooked);
  const bookedSlots = timeSlots.filter(slot => slot.isBooked);

  return (
    <Card className="p-4 mb-6 bg-muted/50">
      <h4 className="text-sm font-medium mb-2">
        {roomName} - {date.toLocaleDateString()}
      </h4>
      
      <ScrollArea className="h-[200px] rounded-md">
        <div className="space-y-4">
          {availableSlots.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-green-600 mb-2">Available slots:</h5>
              <ul className="space-y-1">
                {availableSlots.map((slot, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    {slot.start}-{slot.end} ({slot.duration})
                  </li>
                ))}
              </ul>
            </div>
          )}

          {bookedSlots.length > 0 && (
            <div>
              <h5 className="text-sm font-medium text-red-600 mb-2">Currently booked:</h5>
              <ul className="space-y-1">
                {bookedSlots.map((slot, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    {slot.start}-{slot.end} - {slot.eventName} ({slot.bookedBy})
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
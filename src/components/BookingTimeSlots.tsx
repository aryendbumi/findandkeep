import { Card } from "./ui/card";
import { ScrollArea } from "./ui/scroll-area";
import { TimeSlotList } from "./booking/TimeSlotList";
import type { TimeSlot } from "@/types/timeSlot";

interface BookingTimeSlotsProps {
  roomName: string;
  date: Date | undefined;
  timeSlots: TimeSlot[];
}

export function BookingTimeSlots({ roomName, date, timeSlots }: BookingTimeSlotsProps) {
  if (!date) return null;

  return (
    <Card className="p-4 mb-6 bg-muted/50">
      <h4 className="text-sm font-medium mb-2">
        {roomName} - {date.toLocaleDateString()}
      </h4>
      
      <ScrollArea className="h-[200px] rounded-md">
        <div className="space-y-4">
          <TimeSlotList slots={timeSlots} type="available" />
          <TimeSlotList slots={timeSlots} type="booked" />
        </div>
      </ScrollArea>
    </Card>
  );
}
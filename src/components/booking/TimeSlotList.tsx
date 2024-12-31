import { TimeSlot } from "@/types/timeSlot";

interface TimeSlotListProps {
  slots: TimeSlot[];
  type: "available" | "booked";
}

export function TimeSlotList({ slots, type }: TimeSlotListProps) {
  const filteredSlots = slots.filter(slot => 
    type === "available" ? !slot.isBooked : slot.isBooked
  );

  if (filteredSlots.length === 0) return null;

  return (
    <div>
      <h5 className={`text-sm font-medium mb-2 ${
        type === "available" ? "text-green-600" : "text-red-600"
      }`}>
        {type === "available" ? "Available slots:" : "Currently booked:"}
      </h5>
      <ul className="space-y-1">
        {filteredSlots.map((slot, index) => (
          <li key={index} className="text-sm text-muted-foreground">
            {slot.start}-{slot.end}
            {type === "booked" && ` - ${slot.eventName} (${slot.bookedBy})`}
            {type === "available" && ` (${slot.duration})`}
          </li>
        ))}
      </ul>
    </div>
  );
}
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { BookingTimeSlots } from "./BookingTimeSlots";
import { BookingHeader } from "./booking/BookingHeader";
import { BookingTimeInputs } from "./booking/BookingTimeInputs";
import { BookingDetails } from "./booking/BookingDetails";
import { BookingPriority } from "./booking/BookingPriority";
import DatePickerCollapsible from "./DatePickerCollapsible";
import { Loader2 } from "lucide-react";
import { useBookingSubmit } from "./booking/useBookingSubmit";
import { useRoomBookings } from "@/hooks/useRoomBookings";

interface BookingFormProps {
  roomName: string;
  capacity: number;
  onClose?: () => void;
}

export function BookingForm({ roomName, capacity, onClose }: BookingFormProps) {
  const [date, setDate] = useState<Date>();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [agenda, setAgenda] = useState("");
  const [needsZoom, setNeedsZoom] = useState(false);
  const [isExternal, setIsExternal] = useState(false);
  const [attendees, setAttendees] = useState("");
  const [priority, setPriority] = useState("");
  
  const { handleSubmit, isSubmitting } = useBookingSubmit(roomName, onClose);
  
  // Fetch real bookings for the selected date
  const { data: roomBookings = [] } = useRoomBookings(undefined, date);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSubmit({
      date: date!,
      startTime,
      endTime,
      agenda,
      attendees,
      needsZoom,
      isExternal,
      priority
    });
  };

  // Filter bookings for this room and transform to time slot format
  const timeSlots = roomBookings
    .filter(booking => booking.roomName === roomName)
    .map(booking => ({
      start: booking.start,
      end: booking.end,
      duration: calculateDuration(booking.start_time, booking.end_time),
      isBooked: true,
      bookedBy: booking.bookedBy,
      eventName: booking.eventName
    }));

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <BookingHeader roomName={roomName} capacity={capacity} />
      
      <div className="space-y-2">
        <DatePickerCollapsible 
          date={date} 
          onDateChange={setDate} 
        />
      </div>

      {date && (
        <BookingTimeSlots 
          roomName={roomName}
          date={date}
          timeSlots={timeSlots}
        />
      )}

      <BookingTimeInputs
        startTime={startTime}
        endTime={endTime}
        onStartTimeChange={setStartTime}
        onEndTimeChange={setEndTime}
      />

      <BookingDetails
        agenda={agenda}
        attendees={attendees}
        needsZoom={needsZoom}
        isExternal={isExternal}
        capacity={capacity}
        onAgendaChange={setAgenda}
        onAttendeesChange={setAttendees}
        onNeedsZoomChange={setNeedsZoom}
        onIsExternalChange={setIsExternal}
      />

      <BookingPriority
        priority={priority}
        onPriorityChange={setPriority}
      />

      <Button 
        type="submit" 
        className="w-full"
        disabled={isSubmitting}
        aria-label="Confirm room booking"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Booking...
          </>
        ) : (
          "Confirm Booking"
        )}
      </Button>
    </form>
  );
}

// Helper function to calculate duration
function calculateDuration(startTime: string, endTime: string): string {
  const start = new Date(startTime);
  const end = new Date(endTime);
  const diffMs = end.getTime() - start.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  
  if (diffHours < 1) {
    return `${Math.round(diffHours * 60)} mins`;
  } else if (diffHours === 1) {
    return "1 hour";
  } else {
    return `${diffHours} hours`;
  }
}

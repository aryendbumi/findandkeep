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

  const timeSlots = date ? getMockTimeSlots(date) : [];

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

// Helper function for mock data
const getMockTimeSlots = (date: Date) => [
  { start: "07:00", end: "09:00", duration: "2 hours", isBooked: false },
  { 
    start: "09:00", 
    end: "13:00", 
    duration: "4 hours", 
    isBooked: true,
    bookedBy: "John",
    eventName: "Team Meeting"
  },
  { start: "13:00", end: "14:30", duration: "1.5 hours", isBooked: false },
  {
    start: "14:30",
    end: "16:00",
    duration: "1.5 hours",
    isBooked: true,
    bookedBy: "Sarah",
    eventName: "Client Call"
  },
  { 
    start: "16:00", 
    end: "17:00", 
    duration: "1 hour", 
    isBooked: true,
    bookedBy: "Mike",
    eventName: "Sprint Planning"
  },
  { 
    start: "17:00", 
    end: "18:00", 
    duration: "1 hour", 
    isBooked: true,
    bookedBy: "Emma",
    eventName: "Design Review"
  },
  { 
    start: "18:00", 
    end: "19:00", 
    duration: "1 hour", 
    isBooked: true,
    bookedBy: "Alex",
    eventName: "1:1 Meeting"
  },
  { 
    start: "19:00", 
    end: "20:00", 
    duration: "1 hour", 
    isBooked: true,
    bookedBy: "Lisa",
    eventName: "Project Sync"
  },
  { 
    start: "20:00", 
    end: "21:00", 
    duration: "1 hour", 
    isBooked: true,
    bookedBy: "Tom",
    eventName: "Team Retrospective"
  }
];
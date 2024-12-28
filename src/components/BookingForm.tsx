import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { BookingTimeSlots } from "./BookingTimeSlots";
import { BookingHeader } from "./booking/BookingHeader";
import { BookingTimeInputs } from "./booking/BookingTimeInputs";
import { BookingDetails } from "./booking/BookingDetails";
import { BookingPriority } from "./booking/BookingPriority";
import DatePickerCollapsible from "./DatePickerCollapsible";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BookingFormProps {
  roomName: string;
  capacity: number;
  onClose?: () => void;
}

// Enhanced mock data with 10 more bookings
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

export function BookingForm({ roomName, capacity, onClose }: BookingFormProps) {
  const [date, setDate] = useState<Date>();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [agenda, setAgenda] = useState("");
  const [needsZoom, setNeedsZoom] = useState(false);
  const [isExternal, setIsExternal] = useState(false);
  const [attendees, setAttendees] = useState("");
  const [priority, setPriority] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const timeSlots = date ? getMockTimeSlots(date) : [];

  const validateTimeSlot = () => {
    if (!startTime || !endTime) return false;
    
    const [startHour, startMinute] = startTime.split(":").map(Number);
    const [endHour, endMinute] = endTime.split(":").map(Number);
    
    // Check if end time is after start time
    if (endHour < startHour || (endHour === startHour && endMinute <= startMinute)) {
      toast({
        variant: "destructive",
        title: "Invalid Time Range",
        description: "End time must be after start time",
      });
      return false;
    }

    // Check for conflicts with existing bookings
    const newStart = startHour + startMinute / 60;
    const newEnd = endHour + endMinute / 60;

    const hasConflict = timeSlots.some(slot => {
      if (!slot.isBooked) return false;
      
      const [slotStartHour, slotStartMinute] = slot.start.split(":").map(Number);
      const [slotEndHour, slotEndMinute] = slot.end.split(":").map(Number);
      
      const slotStart = slotStartHour + slotStartMinute / 60;
      const slotEnd = slotEndHour + slotEndMinute / 60;

      return (
        (newStart >= slotStart && newStart < slotEnd) ||
        (newEnd > slotStart && newEnd <= slotEnd) ||
        (newStart <= slotStart && newEnd >= slotEnd)
      );
    });

    if (hasConflict) {
      toast({
        variant: "destructive",
        title: "Time Slot Conflict",
        description: "This time slot overlaps with an existing booking",
      });
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !startTime || !endTime || !agenda || !attendees || !priority) {
      toast({
        variant: "destructive",
        title: "Missing Required Fields",
        description: "Please fill in all required fields before booking.",
      });
      return;
    }

    if (!validateTimeSlot()) return;

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Room Booked!",
        description: `You have successfully booked ${roomName} for ${date?.toLocaleDateString()}`,
      });

      // Navigate to home page after successful booking
      navigate("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: "There was an error while booking the room. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";
import { BookingTimeSlots } from "./BookingTimeSlots";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { format } from "date-fns";
import { ChevronDown, ChevronUp } from "lucide-react";

interface BookingFormProps {
  roomName: string;
  capacity: number;
  onClose?: () => void;
}

// Mock data - replace with actual API call
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
  { start: "16:00", end: "21:00", duration: "5 hours", isBooked: false },
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
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const { toast } = useToast();

  const timeSlots = date ? getMockTimeSlots(date) : [];

  const getPriorityWarning = (priority: string) => {
    switch (priority) {
      case "1":
        return "You decide this meeting will be attended by BU Head or above level";
      case "2":
        return "You decide this meeting will be attended by Senior Manager";
      default:
        return null;
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date || !startTime || !endTime || !agenda || !attendees || !priority) {
      toast({
        variant: "destructive",
        title: "Missing Required Fields",
        description: "Please fill in all required fields before booking.",
      });
      return;
    }

    toast({
      title: "Room Booked!",
      description: `You have successfully booked ${roomName} for ${date?.toLocaleDateString()}`,
    });

    if (onClose) {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Book {roomName}</h3>
        <p className="text-sm text-muted-foreground mb-6">Capacity: {capacity} people</p>
      </div>

      <div className="space-y-2">
        <Label>Select Date <span className="text-red-500">*</span></Label>
        <Collapsible open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="outline" className="w-full justify-between">
              <span>{date ? format(date, "PPP") : "Pick a date"}</span>
              {isCalendarOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent className="mt-2">
            <Calendar
              mode="single"
              selected={date}
              onSelect={(newDate) => {
                setDate(newDate);
                setIsCalendarOpen(false);
              }}
              className="rounded-md border mx-auto"
            />
          </CollapsibleContent>
        </Collapsible>
      </div>

      {date && <BookingTimeSlots 
        roomName={roomName}
        date={date}
        timeSlots={timeSlots}
      />}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time <span className="text-red-500">*</span></Label>
          <Input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
            className="w-full"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime">End Time <span className="text-red-500">*</span></Label>
          <Input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
            className="w-full"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="agenda">Topic/Agenda <span className="text-red-500">*</span></Label>
        <Input
          id="agenda"
          value={agenda}
          onChange={(e) => setAgenda(e.target.value)}
          placeholder="Enter meeting agenda"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="attendees">Number of Attendees <span className="text-red-500">*</span></Label>
        <Input
          id="attendees"
          type="number"
          value={attendees}
          onChange={(e) => setAttendees(e.target.value)}
          max={capacity}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="zoom"
          checked={needsZoom}
          onCheckedChange={setNeedsZoom}
        />
        <Label htmlFor="zoom">Need Zoom Meeting?</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="external"
          checked={isExternal}
          onCheckedChange={setIsExternal}
        />
        <Label htmlFor="external">External Meeting</Label>
      </div>

      <div className="space-y-2">
        <Label>Priority <span className="text-red-500">*</span></Label>
        <RadioGroup onValueChange={setPriority} value={priority} required>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="1" id="p1" />
            <Label htmlFor="p1">Priority 1</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="2" id="p2" />
            <Label htmlFor="p2">Priority 2</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="3" id="p3" />
            <Label htmlFor="p3">Priority 3</Label>
          </div>
        </RadioGroup>
      </div>

      {getPriorityWarning(priority) && (
        <Alert className="bg-red-50 border-red-100">
          <AlertDescription className="text-red-600">
            {getPriorityWarning(priority)}
          </AlertDescription>
        </Alert>
      )}

      <Button type="submit" className="w-full">
        Confirm Booking
      </Button>
    </form>
  );
}
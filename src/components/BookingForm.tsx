import { useState } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Switch } from "@/components/ui/switch";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useToast } from "@/components/ui/use-toast";

interface BookingFormProps {
  roomName: string;
  capacity: number;
}

export function BookingForm({ roomName, capacity }: BookingFormProps) {
  const [date, setDate] = useState<Date>();
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [agenda, setAgenda] = useState("");
  const [needsZoom, setNeedsZoom] = useState(false);
  const [attendees, setAttendees] = useState("");
  const [priority, setPriority] = useState("");
  const { toast } = useToast();

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
    // Here you would typically save the booking to your backend
    toast({
      title: "Room Booked!",
      description: `You have successfully booked ${roomName} for ${date?.toLocaleDateString()}`,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Book {roomName}</h3>
        <p className="text-sm text-muted-foreground mb-6">Capacity: {capacity} people</p>
      </div>

      <div className="space-y-2">
        <Label>Select Date</Label>
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          className="rounded-md border"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startTime">Start Time</Label>
          <Input
            id="startTime"
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endTime">End Time</Label>
          <Input
            id="endTime"
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="agenda">Topic/Agenda</Label>
        <Input
          id="agenda"
          value={agenda}
          onChange={(e) => setAgenda(e.target.value)}
          placeholder="Enter meeting agenda"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="attendees">Number of Attendees</Label>
        <Input
          id="attendees"
          type="number"
          value={attendees}
          onChange={(e) => setAttendees(e.target.value)}
          max={capacity}
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

      <div className="space-y-2">
        <Label>Priority</Label>
        <RadioGroup onValueChange={setPriority} value={priority}>
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
        <Alert>
          <AlertDescription>
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
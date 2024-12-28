import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BookingTimeInputsProps {
  startTime: string;
  endTime: string;
  onStartTimeChange: (value: string) => void;
  onEndTimeChange: (value: string) => void;
}

export function BookingTimeInputs({
  startTime,
  endTime,
  onStartTimeChange,
  onEndTimeChange,
}: BookingTimeInputsProps) {
  const validateTimeInput = (value: string) => {
    // Ensure the time is in valid 24-hour format between 00:00-23:59
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(value) ? value : "";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="startTime">Start Time <span className="text-red-500">*</span></Label>
        <Input
          id="startTime"
          type="time"
          value={startTime}
          onChange={(e) => onStartTimeChange(validateTimeInput(e.target.value))}
          required
          className="w-full"
          min="00:00"
          max="23:59"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="endTime">End Time <span className="text-red-500">*</span></Label>
        <Input
          id="endTime"
          type="time"
          value={endTime}
          onChange={(e) => onEndTimeChange(validateTimeInput(e.target.value))}
          required
          className="w-full"
          min="00:00"
          max="23:59"
        />
      </div>
    </div>
  );
}
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
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="startTime">Start Time <span className="text-red-500">*</span></Label>
        <Input
          id="startTime"
          type="time"
          value={startTime}
          onChange={(e) => onStartTimeChange(e.target.value)}
          required
          className="w-full"
          step="60"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="endTime">End Time <span className="text-red-500">*</span></Label>
        <Input
          id="endTime"
          type="time"
          value={endTime}
          onChange={(e) => onEndTimeChange(e.target.value)}
          required
          className="w-full"
          step="60"
        />
      </div>
    </div>
  );
}
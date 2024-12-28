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
        <Label htmlFor="startTime">Start Time (24-hour) <span className="text-red-500">*</span></Label>
        <Input
          id="startTime"
          type="time"
          value={startTime}
          onChange={(e) => onStartTimeChange(e.target.value)}
          required
          className="w-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-datetime-edit-ampm-field]:hidden [&::-webkit-inner-spin-button]:hidden"
          min="00:00"
          max="23:59"
          pattern="[0-9]{2}:[0-9]{2}"
          style={{
            WebkitAppearance: "textfield",
          }}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="endTime">End Time (24-hour) <span className="text-red-500">*</span></Label>
        <Input
          id="endTime"
          type="time"
          value={endTime}
          onChange={(e) => onEndTimeChange(e.target.value)}
          required
          className="w-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-datetime-edit-ampm-field]:hidden [&::-webkit-inner-spin-button]:hidden"
          min="00:00"
          max="23:59"
          pattern="[0-9]{2}:[0-9]{2}"
          style={{
            WebkitAppearance: "textfield",
          }}
        />
      </div>
    </div>
  );
}
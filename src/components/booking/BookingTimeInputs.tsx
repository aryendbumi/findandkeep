import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { toast } from "@/components/ui/use-toast";

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
  const validateAndFormatTime = (value: string) => {
    // Remove any AM/PM indicators and ensure HH:mm format
    const timeOnly = value.replace(/[AaPpMm]/g, '').trim();
    
    // Check if the time is in valid 24-hour format
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):([0-5][0-9])$/;
    if (!timeRegex.test(timeOnly)) {
      toast({
        variant: "destructive",
        title: "Invalid Time Format",
        description: "Please enter time in 24-hour format (00:00-23:59)",
      });
      return "";
    }
    
    // Format to ensure HH:mm (add leading zeros if needed)
    const [hours, minutes] = timeOnly.split(':');
    return `${hours.padStart(2, '0')}:${minutes}`;
  };

  const handleTimeChange = (value: string, isStart: boolean) => {
    const formattedTime = validateAndFormatTime(value);
    if (isStart) {
      onStartTimeChange(formattedTime);
    } else {
      onEndTimeChange(formattedTime);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="startTime">Start Time <span className="text-red-500">*</span></Label>
        <Input
          id="startTime"
          type="time"
          value={startTime}
          onChange={(e) => handleTimeChange(e.target.value, true)}
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
          onChange={(e) => handleTimeChange(e.target.value, false)}
          required
          className="w-full"
          min="00:00"
          max="23:59"
        />
      </div>
    </div>
  );
}
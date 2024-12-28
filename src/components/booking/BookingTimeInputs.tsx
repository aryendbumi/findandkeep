import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
  const [startPeriod, setStartPeriod] = useState<"AM" | "PM">("AM");
  const [endPeriod, setEndPeriod] = useState<"AM" | "PM">("AM");

  const convertTo24Hour = (time: string, period: "AM" | "PM"): string => {
    if (!time) return "";
    
    const [hours, minutes] = time.split(":").map(Number);
    let hour24 = hours;
    
    if (period === "PM" && hours !== 12) {
      hour24 = hours + 12;
    } else if (period === "AM" && hours === 12) {
      hour24 = 0;
    }
    
    return `${hour24.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
  };

  const convertTo12Hour = (time: string): { time: string; period: "AM" | "PM" } => {
    if (!time) return { time: "", period: "AM" };
    
    const [hours, minutes] = time.split(":").map(Number);
    let hour12 = hours % 12;
    hour12 = hour12 || 12; // Convert 0 to 12
    const period = hours >= 12 ? "PM" : "AM";
    
    return {
      time: `${hour12.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`,
      period
    };
  };

  const handleTimeChange = (value: string, isStart: boolean) => {
    const period = isStart ? startPeriod : endPeriod;
    const time24 = convertTo24Hour(value, period);
    
    if (isStart) {
      onStartTimeChange(time24);
    } else {
      onEndTimeChange(time24);
    }
  };

  const handlePeriodChange = (newPeriod: "AM" | "PM", isStart: boolean) => {
    const currentTime = isStart ? startTime : endTime;
    const { time } = convertTo12Hour(currentTime);
    const time24 = convertTo24Hour(time, newPeriod);
    
    if (isStart) {
      setStartPeriod(newPeriod);
      onStartTimeChange(time24);
    } else {
      setEndPeriod(newPeriod);
      onEndTimeChange(time24);
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="space-y-2">
        <Label htmlFor="startTime">Start Time <span className="text-red-500">*</span></Label>
        <div className="flex gap-2">
          <Input
            id="startTime"
            type="time"
            value={convertTo12Hour(startTime).time}
            onChange={(e) => handleTimeChange(e.target.value, true)}
            required
            className="w-full"
          />
          <Select value={startPeriod} onValueChange={(value: "AM" | "PM") => handlePeriodChange(value, true)}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="AM/PM" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AM">AM</SelectItem>
              <SelectItem value="PM">PM</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="endTime">End Time <span className="text-red-500">*</span></Label>
        <div className="flex gap-2">
          <Input
            id="endTime"
            type="time"
            value={convertTo12Hour(endTime).time}
            onChange={(e) => handleTimeChange(e.target.value, false)}
            required
            className="w-full"
          />
          <Select value={endPeriod} onValueChange={(value: "AM" | "PM") => handlePeriodChange(value, false)}>
            <SelectTrigger className="w-24">
              <SelectValue placeholder="AM/PM" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="AM">AM</SelectItem>
              <SelectItem value="PM">PM</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
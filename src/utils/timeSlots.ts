import type { TimeSlot } from "@/types/timeSlot";

export function createTimeSlot(
  start: string,
  end: string,
  duration: string,
  isBooked = false,
  eventName?: string,
  bookedBy?: string
): TimeSlot {
  return {
    start,
    end,
    duration,
    isBooked,
    eventName,
    bookedBy
  };
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit', 
    hour12: false 
  });
}
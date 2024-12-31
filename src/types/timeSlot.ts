export interface TimeSlot {
  start: string;
  end: string;
  duration: string;
  isBooked?: boolean;
  eventName?: string;
  bookedBy?: string;
}
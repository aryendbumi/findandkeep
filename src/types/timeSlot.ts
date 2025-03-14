
export interface TimeSlot {
  id?: string;
  start: string;
  end: string;
  duration: string;
  isBooked?: boolean;
  eventName?: string;
  bookedBy?: string;
}

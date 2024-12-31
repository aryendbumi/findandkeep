export interface Booking {
  id: number;
  title: string;
  roomName: string;
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  organizer: string;
  type: string;
  zoom_required: boolean;
  priority: string;
}
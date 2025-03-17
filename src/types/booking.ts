
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
  user_id: string;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    email: string;
  } | null;
}

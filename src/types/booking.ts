export interface Booking {
  id: string;
  title: string;
  description?: string | null;
  roomName: string;
  room_id: number;
  date: string;
  startTime: string;
  endTime: string;
  start_time: string;
  end_time: string;
  organizer: string;
  priority: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  profiles?: {
    first_name: string | null;
    last_name: string | null;
    email: string;
  } | null;
  rooms?: {
    name: string;
  } | null;
}

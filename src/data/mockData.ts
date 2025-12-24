export interface Room {
  id: number;
  name: string;
  description: string;
  capacity: number;
  image_url: string;
  amenities: string[];
}

export interface LocalBooking {
  id: string;
  room_id: number;
  user_id: string;
  user_email: string;
  user_name: string;
  title: string;
  start_time: string;
  end_time: string;
  attendees: number;
  type: "Internal" | "External";
  zoom_required: boolean;
  priority: string;
  created_at: string;
}

export const mockRooms: Room[] = [
  {
    id: 1,
    name: "Conference Room A",
    description: "Large meeting room with projector and whiteboard",
    capacity: 20,
    image_url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400",
    amenities: ["Projector", "Whiteboard", "Video Conferencing", "Air Conditioning"],
  },
  {
    id: 2,
    name: "Meeting Room B",
    description: "Medium-sized room for team meetings",
    capacity: 10,
    image_url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=400",
    amenities: ["TV Screen", "Whiteboard", "Air Conditioning"],
  },
  {
    id: 3,
    name: "Huddle Space C",
    description: "Small space for quick discussions",
    capacity: 4,
    image_url: "https://images.unsplash.com/photo-1497215842964-222b430dc094?w=400",
    amenities: ["TV Screen", "Standing Desk"],
  },
  {
    id: 4,
    name: "Board Room",
    description: "Executive meeting room with premium amenities",
    capacity: 15,
    image_url: "https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=400",
    amenities: ["Projector", "Video Conferencing", "Catering Service", "Air Conditioning"],
  },
];

const BOOKINGS_STORAGE_KEY = "mock_bookings";

export function getBookings(): LocalBooking[] {
  const stored = localStorage.getItem(BOOKINGS_STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
}

export function saveBooking(booking: LocalBooking): void {
  const bookings = getBookings();
  bookings.push(booking);
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
}

export function deleteBooking(bookingId: string): void {
  const bookings = getBookings();
  const filtered = bookings.filter((b) => b.id !== bookingId);
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(filtered));
}

export function updateBooking(bookingId: string, updates: Partial<LocalBooking>): void {
  const bookings = getBookings();
  const index = bookings.findIndex((b) => b.id === bookingId);
  if (index !== -1) {
    bookings[index] = { ...bookings[index], ...updates };
    localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
  }
}

export function getRooms(): Room[] {
  return mockRooms;
}

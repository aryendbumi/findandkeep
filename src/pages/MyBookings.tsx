import { Calendar, Clock, Users } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

// Mock data - replace with real data from your backend
const bookings = [
  {
    id: 1,
    roomName: "Executive Suite",
    date: "2024-03-20",
    startTime: "10:00",
    endTime: "11:00",
    agenda: "Quarterly Review",
    attendees: 6,
    priority: 1,
  },
  {
    id: 2,
    roomName: "Creative Space",
    date: "2024-03-21",
    startTime: "14:00",
    endTime: "15:00",
    agenda: "Team Brainstorming",
    attendees: 4,
    priority: 3,
  },
];

export default function MyBookings() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">My Bookings</h1>
      <div className="grid gap-4">
        {bookings.map((booking) => (
          <Card key={booking.id}>
            <CardHeader>
              <h3 className="text-lg font-semibold">{booking.roomName}</h3>
              <p className="text-sm text-muted-foreground">{booking.agenda}</p>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(booking.date).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>{booking.startTime} - {booking.endTime}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4" />
                  <span>{booking.attendees} attendees</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
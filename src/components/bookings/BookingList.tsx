import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Calendar, Clock, Users } from "lucide-react";
import { type Booking } from "@/types/booking";

interface BookingListProps {
  bookings: Booking[];
}

export function BookingList({ bookings }: BookingListProps) {
  if (!bookings.length) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">No bookings found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {bookings.map((booking) => (
        <Card key={booking.id}>
          <CardHeader>
            <h3 className="text-lg font-semibold">{booking.roomName}</h3>
            <p className="text-sm text-muted-foreground">{booking.title}</p>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>{booking.date}</span>
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
  );
}
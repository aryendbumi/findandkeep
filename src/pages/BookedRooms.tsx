import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useBookings } from "@/hooks/useBookings";
import { Skeleton } from "@/components/ui/skeleton";

export default function BookedRooms() {
  const [date, setDate] = useState<Date>();
  const { data: bookings = [], isLoading } = useBookings();

  // Calculate room usage from real bookings
  const roomUsageData = bookings.reduce((acc: { name: string; bookings: number }[], booking) => {
    const existingRoom = acc.find(r => r.name === booking.roomName);
    if (existingRoom) {
      existingRoom.bookings += 1;
    } else {
      acc.push({ name: booking.roomName || 'Unknown Room', bookings: 1 });
    }
    return acc;
  }, []);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Booked Rooms Overview</h1>
        <div className="space-y-4">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Booked Rooms Overview</h1>
      
      <Tabs defaultValue="timeline" className="space-y-4">
        <TabsList>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="block">Block Schedule</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          {bookings.length === 0 ? (
            <Card>
              <CardContent className="p-4 text-center text-muted-foreground">
                No bookings found
              </CardContent>
            </Card>
          ) : (
            bookings.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{booking.roomName}</h3>
                      <p className="text-sm text-muted-foreground">{booking.title}</p>
                      <p className="text-sm">Organizer: {booking.organizer}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm">{booking.date}</p>
                      <p className="text-sm">{booking.startTime} - {booking.endTime}</p>
                      <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                        booking.priority === 'high' ? 'bg-red-100 text-red-800' :
                        booking.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {booking.priority || 'Normal'}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        <TabsContent value="calendar">
          <Card>
            <CardContent className="p-4">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-md border"
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="block">
          <Card>
            <CardContent className="p-4">
              <div className="grid grid-cols-5 gap-4">
                {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map((day) => (
                  <div key={day} className="space-y-2">
                    <h3 className="font-semibold text-center">{day}</h3>
                    <div className="h-96 border rounded-md p-2">
                      {/* Block schedule content will go here */}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-4">Room Usage Statistics</h3>
              {roomUsageData.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">No booking data available for analytics</p>
              ) : (
                <div className="w-full h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={roomUsageData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="bookings" fill="hsl(var(--primary))" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

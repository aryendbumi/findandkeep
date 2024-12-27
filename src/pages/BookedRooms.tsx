import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

// Mock data for bookings
const bookings = [
  {
    id: 1,
    roomName: "Productivity Room",
    date: "2024-12-15",
    startTime: "09:00",
    endTime: "10:30",
    agenda: "Q4 Review",
    organizer: "John Doe",
    priority: 1,
  },
  {
    id: 2,
    roomName: "Availability Room",
    date: "2024-12-16",
    startTime: "14:00",
    endTime: "15:00",
    agenda: "Team Sync",
    organizer: "Jane Smith",
    priority: 2,
  },
  {
    id: 3,
    roomName: "Efficiency Room",
    date: "2024-12-20",
    startTime: "11:00",
    endTime: "12:00",
    agenda: "Client Meeting",
    organizer: "Mike Johnson",
    priority: 1,
  },
  {
    id: 4,
    roomName: "TAT Meeting Room",
    date: "2025-01-05",
    startTime: "13:00",
    endTime: "14:30",
    agenda: "2025 Planning",
    organizer: "Sarah Wilson",
    priority: 1,
  },
  {
    id: 5,
    roomName: "Utilization Room",
    date: "2025-01-10",
    startTime: "15:00",
    endTime: "16:00",
    agenda: "Department Update",
    organizer: "Tom Brown",
    priority: 3,
  },
];

// Mock data for charts
const roomUsageData = [
  { name: 'Productivity Room', bookings: 15 },
  { name: 'Availability Room', bookings: 12 },
  { name: 'Efficiency Room', bookings: 8 },
  { name: 'Utilization Room', bookings: 6 },
  { name: 'TAT Meeting Room', bookings: 10 },
];

export default function BookedRooms() {
  const [date, setDate] = useState<Date>();

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
          {bookings.map((booking) => (
            <Card key={booking.id}>
              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold">{booking.roomName}</h3>
                    <p className="text-sm text-muted-foreground">{booking.agenda}</p>
                    <p className="text-sm">Organizer: {booking.organizer}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm">{new Date(booking.date).toLocaleDateString()}</p>
                    <p className="text-sm">{booking.startTime} - {booking.endTime}</p>
                    <span className={`inline-block px-2 py-1 rounded-full text-xs ${
                      booking.priority === 1 ? 'bg-red-100 text-red-800' :
                      booking.priority === 2 ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }`}>
                      Priority {booking.priority}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
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
              <div className="w-full h-[400px]">
                <BarChart width={800} height={300} data={roomUsageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="bookings" fill="#8884d8" />
                </BarChart>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
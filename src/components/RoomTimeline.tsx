import { Card } from "./ui/card";

// Extended mock data for better visualization
const bookings = [
  {
    id: 1,
    roomId: 1,
    startTime: "09:00",
    endTime: "10:30",
    title: "Q4 Review",
    priority: "high",
  },
  {
    id: 2,
    roomId: 2,
    startTime: "14:00",
    endTime: "15:00",
    title: "Team Sync",
    priority: "medium",
  },
  {
    id: 3,
    roomId: 3,
    startTime: "11:00",
    endTime: "12:00",
    title: "Client Meeting",
    priority: "high",
  },
  {
    id: 4,
    roomId: 1,
    startTime: "13:00",
    endTime: "14:30",
    title: "2025 Planning",
    priority: "high",
  },
  {
    id: 5,
    roomId: 4,
    startTime: "15:00",
    endTime: "16:00",
    title: "Department Update",
    priority: "low",
  },
  {
    id: 6,
    roomId: 5,
    startTime: "08:00",
    endTime: "09:00",
    title: "Daily Standup",
    priority: "medium",
  },
];

const rooms = [
  { id: 1, name: "Productivity Room" },
  { id: 2, name: "Availability Room" },
  { id: 3, name: "Efficiency Room" },
  { id: 4, name: "Utilization Room" },
  { id: 5, name: "TAT Meeting Room" },
];

const timeSlots = Array.from({ length: 15 }, (_, i) => {
  const hour = i + 7; // Start from 07:00
  return `${hour.toString().padStart(2, "0")}:00`;
});

const RoomTimeline = () => {
  const getBookingPosition = (startTime: string) => {
    const [hours] = startTime.split(":").map(Number);
    return ((hours - 7) / 14) * 100; // 7 is start hour, 14 is total hours (21-7)
  };

  const getBookingWidth = (startTime: string, endTime: string) => {
    const [startHours, startMinutes] = startTime.split(":").map(Number);
    const [endHours, endMinutes] = endTime.split(":").map(Number);
    const duration = (endHours + endMinutes / 60) - (startHours + startMinutes / 60);
    return (duration / 14) * 100; // 14 is total hours
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-500";
      case "medium":
        return "bg-yellow-500";
      case "low":
        return "bg-green-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Card className="p-4">
      <div className="mb-4 flex">
        <div className="w-48 flex-shrink-0"></div>
        <div className="flex-1 flex">
          {timeSlots.map((time) => (
            <div
              key={time}
              className="flex-1 text-xs text-gray-500 text-center border-l border-gray-200"
            >
              {time}
            </div>
          ))}
        </div>
      </div>

      {rooms.map((room) => (
        <div key={room.id} className="flex mb-4 relative">
          <div className="w-48 flex-shrink-0 pr-4">
            <p className="text-sm font-medium truncate">{room.name}</p>
          </div>
          <div className="flex-1 h-8 bg-gray-50 relative">
            {bookings
              .filter((booking) => booking.roomId === room.id)
              .map((booking) => (
                <div
                  key={booking.id}
                  className={`absolute h-full rounded ${getPriorityColor(
                    booking.priority
                  )} text-white text-xs flex items-center px-2 truncate`}
                  style={{
                    left: `${getBookingPosition(booking.startTime)}%`,
                    width: `${getBookingWidth(booking.startTime, booking.endTime)}%`,
                  }}
                  title={`${booking.title} (${booking.startTime}-${booking.endTime})`}
                >
                  {booking.title}
                </div>
              ))}
          </div>
        </div>
      ))}
    </Card>
  );
};

export default RoomTimeline;
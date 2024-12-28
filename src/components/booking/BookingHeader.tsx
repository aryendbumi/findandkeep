interface BookingHeaderProps {
  roomName: string;
  capacity: number;
}

export function BookingHeader({ roomName, capacity }: BookingHeaderProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Book {roomName}</h3>
      <p className="text-sm text-muted-foreground mb-6">Capacity: {capacity} people</p>
    </div>
  );
}
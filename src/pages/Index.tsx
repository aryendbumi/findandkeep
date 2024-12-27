import { RoomCard } from "@/components/RoomCard";
import { RoomFilter } from "@/components/RoomFilter";

// Mock data - replace with real data later
const rooms = [
  {
    id: 1,
    name: "Executive Suite",
    description: "Elegant meeting room with city views",
    capacity: 8,
    pricePerHour: 75,
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c",
    amenities: ["wifi", "coffee", "tv"],
  },
  {
    id: 2,
    name: "Creative Space",
    description: "Bright and inspiring collaboration room",
    capacity: 6,
    pricePerHour: 60,
    imageUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
    amenities: ["wifi", "coffee"],
  },
  {
    id: 3,
    name: "Board Room",
    description: "Professional setting for important meetings",
    capacity: 12,
    pricePerHour: 100,
    imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
    amenities: ["wifi", "coffee", "tv"],
  },
];

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Find your perfect meeting space</h1>
          <p className="mt-2 text-muted-foreground">Professional rooms for your business needs</p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <RoomFilter />
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <RoomCard key={room.id} {...room} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
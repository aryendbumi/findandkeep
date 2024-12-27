import { RoomCard } from "@/components/RoomCard";
import { RoomFilter } from "@/components/RoomFilter";
import { useState } from "react";

const rooms = [
  {
    id: 1,
    name: "Productivity Room",
    description: "Big bright functional meeting room with focused slide display to enhance collaboration between meeting participants.",
    capacity: 16,
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c",
    amenities: ["wifi", "coffee", "tv"],
  },
  {
    id: 2,
    name: "Availability Room",
    description: "Wide and dark meeting room to inspire discussion between participants.",
    capacity: 8,
    imageUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
    amenities: ["wifi", "coffee", "tv"],
  },
  {
    id: 3,
    name: "Efficiency Room",
    description: "Simple, fast and lively meeting room with Workshop views. Uses TV monitor and specified for quick decision nature.",
    capacity: 6,
    imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72",
    amenities: ["wifi", "tv"],
  },
  {
    id: 4,
    name: "Utilization Room",
    description: "Small meeting room with professional setting for close and calm discussion.",
    capacity: 4,
    imageUrl: "https://images.unsplash.com/photo-1497366216548-37526070297c",
    amenities: ["wifi"],
  },
  {
    id: 5,
    name: "TAT Meeting Room",
    description: "Big, elegant meeting room with amazing view to stimulate dopamine release for more creative decision and problem solving.",
    capacity: 12,
    imageUrl: "https://images.unsplash.com/photo-1497366811353-6870744d04b2",
    amenities: ["wifi", "coffee", "tv"],
  },
];

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [capacityFilter, setCapacityFilter] = useState("any");

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCapacity = capacityFilter === "any" ||
      (capacityFilter === "1-4" && room.capacity <= 4) ||
      (capacityFilter === "5-8" && room.capacity > 4 && room.capacity <= 8) ||
      (capacityFilter === "9+" && room.capacity > 8);

    return matchesSearch && matchesCapacity;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Get Your Room, Fast</h1>
          <p className="mt-2 text-muted-foreground">Professional meeting room for business needs</p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <RoomFilter 
          onSearchChange={setSearchQuery}
          onCapacityChange={setCapacityFilter}
        />
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} {...room} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
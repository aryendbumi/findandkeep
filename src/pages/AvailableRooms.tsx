import { useState } from "react";
import { getRooms } from "@/data/mockData";
import { RoomCard } from "@/components/RoomCard";
import { RoomFilter } from "@/components/RoomFilter";

const AvailableRooms = () => {
  const rooms = getRooms();
  const [searchQuery, setSearchQuery] = useState("");
  const [capacityFilter, setCapacityFilter] = useState("any");

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const handleCapacityChange = (value: string) => {
    setCapacityFilter(value);
  };

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         room.description?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;

    if (capacityFilter === "any") return true;
    
    const capacity = room.capacity;
    switch (capacityFilter) {
      case "1-4":
        return capacity >= 1 && capacity <= 4;
      case "5-8":
        return capacity >= 5 && capacity <= 8;
      case "9+":
        return capacity >= 9;
      default:
        return true;
    }
  });

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Available Rooms</h1>
          <RoomFilter 
            onSearchChange={handleSearchChange}
            onCapacityChange={handleCapacityChange}
          />
        </div>
        
        {filteredRooms.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No rooms available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredRooms.map((room) => (
              <RoomCard 
                key={room.id}
                name={room.name}
                description={room.description || ""}
                capacity={room.capacity}
                image_url={room.image_url || ""}
                amenities={room.amenities || []}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AvailableRooms;

import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { RoomCard } from "@/components/RoomCard";
import { RoomFilter } from "@/components/RoomFilter";
import { toast } from "@/components/ui/use-toast";

const AvailableRooms = () => {
  const [rooms, setRooms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [capacityFilter, setCapacityFilter] = useState("any");

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const { data, error } = await supabase
          .from('rooms')
          .select('*')
          .order('name');

        if (error) {
          throw error;
        }

        setRooms(data || []);
      } catch (error) {
        console.error('Error fetching rooms:', error);
        toast({
          title: "Error",
          description: "Failed to fetch available rooms",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, []);

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

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-64 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

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
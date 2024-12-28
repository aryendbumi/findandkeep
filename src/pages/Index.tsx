import { RoomCard } from "@/components/RoomCard";
import { RoomFilter } from "@/components/RoomFilter";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Link } from "react-router-dom";
import RoomTimeline from "@/components/RoomTimeline";

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
    imageUrl: "https://images.unsplash.com/photo-1483058712412-4245e9b90334",
    amenities: ["wifi", "tv"],
  },
  {
    id: 4,
    name: "Utilization Room",
    description: "Small meeting room with professional setting for close and calm discussion.",
    capacity: 4,
    imageUrl: "https://images.unsplash.com/photo-1581092795360-fd1ca04f0952",
    amenities: ["wifi"],
  },
  {
    id: 5,
    name: "TAT Meeting Room",
    description: "Big, elegant meeting room with amazing view to stimulate dopamine release for more creative decision and problem solving.",
    capacity: 12,
    imageUrl: "https://images.unsplash.com/photo-1497604401993-f2e922e5cb0a",
    amenities: ["wifi", "coffee", "tv"],
  },
];

const Index = () => {
  console.log("Index component rendering");
  const [searchQuery, setSearchQuery] = useState("");
  const [capacityFilter, setCapacityFilter] = useState("any");
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);

  const filteredRooms = rooms.filter(room => {
    console.log("Filtering rooms with query:", searchQuery, "and capacity:", capacityFilter);
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
      <header className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">
            Find 'N Keep, now!
          </h1>
          <p className="mt-2 text-muted-foreground">
            Simplify your meeting room bookings.
          </p>
        </div>
      </header>
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Collapsible 
            open={isTimelineOpen} 
            onOpenChange={setIsTimelineOpen}
            className="transition-all duration-300"
          >
            <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm mb-2">
              <CollapsibleTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="flex items-center gap-2 w-full justify-between hover:bg-gray-50 transition-colors duration-200"
                >
                  <span className="font-medium text-lg">Booked Rooms</span>
                  {isTimelineOpen ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </Button>
              </CollapsibleTrigger>
              <Link 
                to="/booked-rooms" 
                className="text-sm text-primary hover:underline transition-colors duration-200"
              >
                View All Bookings
              </Link>
            </div>
            <CollapsibleContent className="transition-all duration-300 ease-in-out">
              <div className="bg-white rounded-lg shadow-sm p-4 relative">
                <RoomTimeline />
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>

        <RoomFilter 
          onSearchChange={setSearchQuery}
          onCapacityChange={setCapacityFilter}
        />
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredRooms.map((room) => {
            console.log("Rendering room:", room.name);
            return <RoomCard key={room.id} {...room} />;
          })}
        </div>
      </main>
    </div>
  );
};

export default Index;

import { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, UserCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { RoomCard } from "@/components/RoomCard";
import { RoomFilter } from "@/components/RoomFilter";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { ChevronDown, ChevronUp } from "lucide-react";
import RoomTimeline from "@/components/RoomTimeline";
import { useQuery } from "@tanstack/react-query";

const fetchRooms = async () => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*');
  
  if (error) throw error;
  return data;
};

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [capacityFilter, setCapacityFilter] = useState("any");
  const [isTimelineOpen, setIsTimelineOpen] = useState(false);

  const { data: rooms = [], isLoading, error } = useQuery({
    queryKey: ['rooms'],
    queryFn: fetchRooms,
  });

  useEffect(() => {
    if (error) {
      toast({
        title: "Error",
        description: "Failed to fetch rooms. Please try again later.",
        variant: "destructive",
      });
    }
  }, [error]);

  const filteredRooms = rooms.filter(room => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (room.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCapacity = capacityFilter === "any" ||
      (capacityFilter === "1-4" && room.capacity <= 4) ||
      (capacityFilter === "5-8" && room.capacity > 4 && room.capacity <= 8) ||
      (capacityFilter === "9+" && room.capacity > 8);

    return matchesSearch && matchesCapacity;
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2 text-sm text-gray-600">Loading rooms...</p>
        </div>
      </div>
    );
  }

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
                  className="flex items-center gap-2 w-full justify-between hover:bg-gray-50 transition-colors duration-200 md:w-auto"
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
                className="text-sm text-primary hover:underline transition-colors duration-200 hidden md:block"
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
          {filteredRooms.map((room) => (
            <RoomCard key={room.id} {...room} />
          ))}
        </div>
      </main>
    </div>
  );
};

export default Index;
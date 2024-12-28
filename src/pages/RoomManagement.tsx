import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import RoomList from "@/components/rooms/RoomList";
import RoomDialog from "@/components/rooms/RoomDialog";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const RoomManagement = () => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);
  const { toast } = useToast();

  const { data: rooms, refetch } = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data;
    },
  });

  const handleAddRoom = () => {
    setSelectedRoom(null);
    setIsDialogOpen(true);
  };

  const handleEditRoom = (room: any) => {
    setSelectedRoom(room);
    setIsDialogOpen(true);
  };

  const handleDeleteRoom = async (roomId: number) => {
    try {
      const { error } = await supabase
        .from("rooms")
        .delete()
        .eq("id", roomId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Room deleted successfully",
      });
      refetch();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Room Management</h1>
          <p className="text-muted-foreground">Manage meeting rooms and their settings</p>
        </div>
        <Button onClick={handleAddRoom}>
          <Plus className="h-4 w-4 mr-2" />
          Add Room
        </Button>
      </div>

      <RoomList
        rooms={rooms || []}
        onEdit={handleEditRoom}
        onDelete={handleDeleteRoom}
      />

      <RoomDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        room={selectedRoom}
        onSuccess={() => {
          setIsDialogOpen(false);
          refetch();
        }}
      />
    </div>
  );
};

export default RoomManagement;
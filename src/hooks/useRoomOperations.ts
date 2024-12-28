import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { RoomFormData } from "@/components/rooms/RoomForm";

export function useRoomOperations(onSuccess: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleRoomSubmit = async (values: RoomFormData, roomId?: number) => {
    setIsSubmitting(true);
    try {
      const amenitiesArray = values.amenities
        ? values.amenities.split(",").map((item) => item.trim())
        : [];

      const roomData = {
        name: values.name,
        description: values.description,
        capacity: values.capacity,
        amenities: amenitiesArray,
      };

      if (roomId) {
        const { error } = await supabase
          .from("rooms")
          .update(roomData)
          .eq("id", roomId);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Room updated successfully",
        });
      } else {
        const { error } = await supabase.from("rooms").insert([roomData]);

        if (error) throw error;

        toast({
          title: "Success",
          description: "Room created successfully",
        });
      }

      onSuccess();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    handleRoomSubmit,
    isSubmitting,
  };
}
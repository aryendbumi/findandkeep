import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { RoomFormData } from "@/components/rooms/RoomForm";

const MAX_AMENITY_LENGTH = 50;
const MAX_AMENITIES_COUNT = 20;

function sanitizeAmenities(amenitiesString: string): string[] {
  if (!amenitiesString || !amenitiesString.trim()) {
    return [];
  }

  return amenitiesString
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .slice(0, MAX_AMENITIES_COUNT)
    .map((item) => item.slice(0, MAX_AMENITY_LENGTH).replace(/[<>'"&]/g, ''));
}

function getSafeErrorMessage(error: unknown, defaultMessage: string): string {
  // Don't expose raw database error messages to users
  return defaultMessage;
}

export function useRoomOperations(onSuccess: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleRoomSubmit = async (values: RoomFormData, roomId?: number) => {
    setIsSubmitting(true);
    try {
      const amenitiesArray = sanitizeAmenities(values.amenities || "");

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
    } catch (error: unknown) {
      console.error("Room operation error:", error);
      toast({
        title: "Error",
        description: getSafeErrorMessage(error, "Failed to save room. Please try again."),
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
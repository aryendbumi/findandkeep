import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import type { RoomFormData } from "@/components/rooms/RoomForm";

const MAX_AMENITY_LENGTH = 50;
const MAX_AMENITIES_COUNT = 20;

function sanitizeAmenities(amenities: string[]): string[] {
  return amenities
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .slice(0, MAX_AMENITIES_COUNT)
    .map((item) => item.slice(0, MAX_AMENITY_LENGTH).replace(/[<>'"&]/g, ''));
}

function getSafeErrorMessage(error: unknown, defaultMessage: string): string {
  return defaultMessage;
}

export function useRoomOperations(onSuccess: () => void) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const uploadPhoto = async (file: File, roomName: string): Promise<string | null> => {
    const fileExt = file.name.split(".").pop();
    const fileName = `${Date.now()}-${roomName.replace(/\s+/g, "-")}.${fileExt}`;
    const { error } = await supabase.storage.from("room-photos").upload(fileName, file);
    if (error) throw error;
    const { data: urlData } = supabase.storage.from("room-photos").getPublicUrl(fileName);
    return urlData.publicUrl;
  };

  const handleRoomSubmit = async (values: RoomFormData, roomId?: number, photoFile?: File | null) => {
    setIsSubmitting(true);
    try {
      const amenitiesArray = sanitizeAmenities(values.amenities || []);

      let photoUrl: string | undefined;
      if (photoFile) {
        photoUrl = (await uploadPhoto(photoFile, values.name)) ?? undefined;
      }

      const roomData: any = {
        name: values.name,
        location: values.location || null,
        capacity: values.capacity,
        amenities: amenitiesArray,
      };

      if (photoUrl) {
        roomData.photo_url = photoUrl;
      }

      if (roomId) {
        const { error } = await supabase
          .from("rooms")
          .update(roomData)
          .eq("id", roomId);
        if (error) throw error;
        toast({ title: "Success", description: "Room updated successfully" });
      } else {
        const { error } = await supabase.from("rooms").insert([roomData]);
        if (error) throw error;
        toast({ title: "Success", description: "Room created successfully" });
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

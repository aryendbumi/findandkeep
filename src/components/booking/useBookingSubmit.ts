import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

export const useBookingSubmit = (roomName: string, onClose?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();

  const handleSubmit = async (formData: {
    date: Date;
    startTime: string;
    endTime: string;
    agenda: string;
    attendees: string;
    needsZoom: boolean;
    isExternal: boolean;
    priority: string;
  }) => {
    const { date, startTime, endTime, agenda, priority } = formData;

    if (!date || !startTime || !endTime || !agenda || !priority) {
      toast({
        variant: "destructive",
        title: "Missing Required Fields",
        description: "Please fill in all required fields before booking.",
      });
      return;
    }

    if (!user) {
      toast({
        variant: "destructive",
        title: "Not Authenticated",
        description: "Please sign in to book a room.",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Find room by name
      const { data: rooms, error: roomError } = await supabase
        .from("rooms")
        .select("id")
        .eq("name", roomName)
        .maybeSingle();

      if (roomError) throw roomError;
      if (!rooms) throw new Error("Room not found");

      const startDateTime = new Date(date);
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      startDateTime.setHours(startHours, startMinutes, 0, 0);

      const endDateTime = new Date(date);
      const [endHours, endMinutes] = endTime.split(':').map(Number);
      endDateTime.setHours(endHours, endMinutes, 0, 0);

      const { error } = await supabase
        .from("bookings")
        .insert({
          room_id: rooms.id,
          user_id: user.id,
          title: agenda,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          priority: priority.toLowerCase(),
        });

      if (error) throw error;
      
      // Invalidate queries to refresh the data
      queryClient.invalidateQueries({ queryKey: ["all-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["my-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["timeline-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["room-bookings"] });

      toast({
        title: "Room Booked!",
        description: `You have successfully booked ${roomName} for ${date.toLocaleDateString()}`,
      });

      navigate("/dashboard");
      if (onClose) onClose();
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Booking Failed",
        description: error.message || "There was an error while booking the room. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return { handleSubmit, isSubmitting };
};

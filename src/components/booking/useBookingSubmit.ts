import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const useBookingSubmit = (roomName: string, onClose?: () => void) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

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
    const { date, startTime, endTime, agenda, attendees, needsZoom, isExternal, priority } = formData;

    if (!date || !startTime || !endTime || !agenda || !attendees || !priority) {
      toast({
        variant: "destructive",
        title: "Missing Required Fields",
        description: "Please fill in all required fields before booking.",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("User not authenticated");

      const { data: rooms } = await supabase
        .from('rooms')
        .select('id')
        .eq('name', roomName)
        .single();

      if (!rooms) throw new Error("Room not found");

      const startDateTime = new Date(date);
      const [startHours, startMinutes] = startTime.split(':').map(Number);
      startDateTime.setHours(startHours, startMinutes);

      const endDateTime = new Date(date);
      const [endHours, endMinutes] = endTime.split(':').map(Number);
      endDateTime.setHours(endHours, endMinutes);

      const { error: bookingError } = await supabase
        .from('bookings')
        .insert([{
          room_id: rooms.id,
          user_id: user.id,
          title: agenda,
          start_time: startDateTime.toISOString(),
          end_time: endDateTime.toISOString(),
          attendees: parseInt(attendees),
          type: isExternal ? 'External' : 'Internal',
          zoom_required: needsZoom,
          priority: priority.toLowerCase()
        }]);

      if (bookingError) throw bookingError;

      toast({
        title: "Room Booked!",
        description: `You have successfully booked ${roomName} for ${date.toLocaleDateString()}`,
      });

      navigate("/");
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
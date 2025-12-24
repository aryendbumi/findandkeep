import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Room {
  id: number;
  name: string;
  capacity: number;
  location: string | null;
  amenities: string[] | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export function useRooms() {
  return useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("is_active", true)
        .order("name");
      
      if (error) throw error;
      return data as Room[];
    },
  });
}

export function useAllRooms() {
  return useQuery({
    queryKey: ["all-rooms"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("rooms")
        .select("*")
        .order("name");
      
      if (error) throw error;
      return data as Room[];
    },
  });
}

export function useRefreshRooms() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: ["rooms"] });
    queryClient.invalidateQueries({ queryKey: ["all-rooms"] });
  };
}

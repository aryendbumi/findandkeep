import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  amenities: z.string(),
});

interface RoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room?: any;
  onSuccess: () => void;
}

const RoomDialog = ({ open, onOpenChange, room, onSuccess }: RoomDialogProps) => {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
      capacity: 1,
      amenities: "",
    },
  });

  useEffect(() => {
    if (room) {
      form.reset({
        name: room.name,
        description: room.description || "",
        capacity: room.capacity,
        amenities: room.amenities?.join(", ") || "",
      });
    } else {
      form.reset({
        name: "",
        description: "",
        capacity: 1,
        amenities: "",
      });
    }
  }, [room, form]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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

      if (room) {
        const { error } = await supabase
          .from("rooms")
          .update(roomData)
          .eq("id", room.id);

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
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{room ? "Edit Room" : "Add Room"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Enter room name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Enter room description"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="capacity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacity</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="number"
                      min={1}
                      onChange={(e) =>
                        field.onChange(parseInt(e.target.value, 10))
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amenities"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amenities (comma-separated)</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Projector, Whiteboard, Video Conference"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit">
                {room ? "Update Room" : "Create Room"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default RoomDialog;
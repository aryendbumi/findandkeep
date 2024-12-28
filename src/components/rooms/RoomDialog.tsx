import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { RoomForm, type RoomFormData } from "./RoomForm";
import { useRoomOperations } from "@/hooks/useRoomOperations";

interface RoomDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  room?: any;
  onSuccess: () => void;
}

const RoomDialog = ({ open, onOpenChange, room, onSuccess }: RoomDialogProps) => {
  const [defaultValues, setDefaultValues] = useState<RoomFormData>({
    name: "",
    description: "",
    capacity: 1,
    amenities: "",
  });

  const { handleRoomSubmit, isSubmitting } = useRoomOperations(onSuccess);

  useEffect(() => {
    if (room) {
      setDefaultValues({
        name: room.name,
        description: room.description || "",
        capacity: room.capacity,
        amenities: room.amenities?.join(", ") || "",
      });
    } else {
      setDefaultValues({
        name: "",
        description: "",
        capacity: 1,
        amenities: "",
      });
    }
  }, [room]);

  const onSubmit = (values: RoomFormData) => {
    handleRoomSubmit(values, room?.id);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{room ? "Edit Room" : "Add Room"}</DialogTitle>
        </DialogHeader>
        <RoomForm
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};

export default RoomDialog;
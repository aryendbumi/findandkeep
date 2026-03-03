import { useEffect, useState } from "react";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
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
    name: "", location: "", capacity: 1, amenities: [],
  });

  const { handleRoomSubmit, isSubmitting } = useRoomOperations(onSuccess);

  useEffect(() => {
    if (room) {
      setDefaultValues({
        name: room.name,
        location: room.location || "",
        capacity: room.capacity,
        amenities: room.amenities || [],
      });
    } else {
      setDefaultValues({ name: "", location: "", capacity: 1, amenities: [] });
    }
  }, [room]);

  const onSubmit = (values: RoomFormData, photoFile?: File | null) => {
    handleRoomSubmit(values, room?.id, photoFile);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>{room ? "Edit Room" : "Add Room"}</DialogTitle>
        </DialogHeader>
        <RoomForm
          key={room?.id ?? "new"}
          defaultValues={defaultValues}
          onSubmit={onSubmit}
          onCancel={() => onOpenChange(false)}
          isSubmitting={isSubmitting}
          currentPhotoUrl={room?.photo_url}
        />
      </DialogContent>
    </Dialog>
  );
};

export default RoomDialog;

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface BookingDetailsProps {
  agenda: string;
  attendees: string;
  needsZoom: boolean;
  isExternal: boolean;
  capacity: number;
  onAgendaChange: (value: string) => void;
  onAttendeesChange: (value: string) => void;
  onNeedsZoomChange: (value: boolean) => void;
  onIsExternalChange: (value: boolean) => void;
}

export function BookingDetails({
  agenda,
  attendees,
  needsZoom,
  isExternal,
  capacity,
  onAgendaChange,
  onAttendeesChange,
  onNeedsZoomChange,
  onIsExternalChange,
}: BookingDetailsProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="agenda">Topic/Agenda <span className="text-red-500">*</span></Label>
        <Input
          id="agenda"
          value={agenda}
          onChange={(e) => onAgendaChange(e.target.value)}
          placeholder="Enter meeting agenda"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="attendees">Number of Attendees <span className="text-red-500">*</span></Label>
        <Input
          id="attendees"
          type="number"
          value={attendees}
          onChange={(e) => onAttendeesChange(e.target.value)}
          max={capacity}
          required
        />
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="zoom"
          checked={needsZoom}
          onCheckedChange={onNeedsZoomChange}
        />
        <Label htmlFor="zoom">Need Zoom Meeting?</Label>
      </div>

      <div className="flex items-center space-x-2">
        <Switch
          id="external"
          checked={isExternal}
          onCheckedChange={onIsExternalChange}
        />
        <Label htmlFor="external">External Meeting</Label>
      </div>
    </>
  );
}
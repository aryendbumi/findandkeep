import { Button } from "./ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import DatePickerCollapsible from "./DatePickerCollapsible";

interface TimelineHeaderProps {
  date: Date;
  onDateChange: (date: Date) => void;
  isExpanded: boolean;
  onExpandToggle: () => void;
}

const TimelineHeader = ({
  date,
  onDateChange,
  isExpanded,
  onExpandToggle,
}: TimelineHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <div className="space-y-1">
        <h3 className="font-semibold">Room Timeline</h3>
        <p className="text-sm text-muted-foreground">
          View room availability and bookings
        </p>
      </div>
      <div className="flex items-center gap-4">
        <DatePickerCollapsible date={date} onDateChange={onDateChange} />
        <Button variant="ghost" size="icon" onClick={onExpandToggle}>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </div>
    </div>
  );
};

export default TimelineHeader;
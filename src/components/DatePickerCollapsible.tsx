import { Button } from "./ui/button";
import { Calendar } from "./ui/calendar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "./ui/collapsible";
import { format } from "date-fns";
import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

interface DatePickerCollapsibleProps {
  date: Date | undefined;
  onDateChange: (date: Date) => void;
}

const DatePickerCollapsible = ({ date, onDateChange }: DatePickerCollapsibleProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <CollapsibleTrigger asChild>
        <Button variant="outline" className="w-[240px] justify-between">
          <span>{date ? format(date, "PPP") : "Pick a date"}</span>
          {isOpen ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </Button>
      </CollapsibleTrigger>
      <CollapsibleContent className="absolute z-50 bg-white rounded-md border shadow-lg mt-2">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(newDate) => {
            if (newDate) {
              onDateChange(newDate);
              setIsOpen(false);
            }
          }}
          initialFocus
        />
      </CollapsibleContent>
    </Collapsible>
  );
};

export default DatePickerCollapsible;
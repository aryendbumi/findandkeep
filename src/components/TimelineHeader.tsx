import { Button } from "./ui/button";
import { ChevronDown, ChevronUp } from "lucide-react";
import DatePickerCollapsible from "./DatePickerCollapsible";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "./ui/accordion";
import { Link } from "react-router-dom";

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
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h3 className="font-semibold">Booked Rooms Status</h3>
          <p className="text-sm text-muted-foreground">
            View today's room bookings
          </p>
        </div>
        <Link to="/dashboard/booked-rooms">
          <Button variant="outline" size="sm">
            View All Bookings
          </Button>
        </Link>
      </div>

      <Accordion type="single" collapsible>
        <AccordionItem value="filters" className="border-none">
          <AccordionTrigger className="py-2">
            <span className="text-sm font-medium">Filters & Options</span>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-2 pb-4 space-y-4">
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default TimelineHeader;
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BookingPriorityProps {
  priority: string;
  onPriorityChange: (value: string) => void;
}

export function BookingPriority({ priority, onPriorityChange }: BookingPriorityProps) {
  const getPriorityWarning = (priority: string) => {
    switch (priority) {
      case "high":
        return "You decide this meeting will be attended by BU Head or above level";
      case "medium":
        return "You decide this meeting will be attended by Senior Manager";
      default:
        return null;
    }
  };

  return (
    <>
      <div className="space-y-2">
        <Label>Priority <span className="text-red-500">*</span></Label>
        <RadioGroup onValueChange={onPriorityChange} value={priority} required>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="high" id="p1" />
            <Label htmlFor="p1">High Priority</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="medium" id="p2" />
            <Label htmlFor="p2">Medium Priority</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="low" id="p3" />
            <Label htmlFor="p3">Low Priority</Label>
          </div>
        </RadioGroup>
      </div>

      {getPriorityWarning(priority) && (
        <Alert className="bg-red-50 border-red-100">
          <AlertDescription className="text-red-600">
            {getPriorityWarning(priority)}
          </AlertDescription>
        </Alert>
      )}
    </>
  );
}

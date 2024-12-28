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
      case "1":
        return "You decide this meeting will be attended by BU Head or above level";
      case "2":
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
            <RadioGroupItem value="1" id="p1" />
            <Label htmlFor="p1">Priority 1</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="2" id="p2" />
            <Label htmlFor="p2">Priority 2</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="3" id="p3" />
            <Label htmlFor="p3">Priority 3</Label>
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
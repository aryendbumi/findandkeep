import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface RoomFilterProps {
  onSearchChange: (value: string) => void;
  onCapacityChange: (value: string) => void;
}

export function RoomFilter({ onSearchChange, onCapacityChange }: RoomFilterProps) {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex-1">
        <Input 
          placeholder="Search rooms..." 
          className="w-full"
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
      <Select 
        defaultValue="any"
        onValueChange={onCapacityChange}
      >
        <SelectTrigger className="w-full md:w-[180px]">
          <SelectValue placeholder="Capacity" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any">Any capacity</SelectItem>
          <SelectItem value="1-4">1-4 people</SelectItem>
          <SelectItem value="5-8">5-8 people</SelectItem>
          <SelectItem value="9+">9+ people</SelectItem>
        </SelectContent>
      </Select>
      <Button className="w-full md:w-auto">
        <Search className="w-4 h-4 mr-2" />
        Search
      </Button>
    </div>
  );
}
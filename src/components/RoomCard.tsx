import { Calendar, Users, Wifi, Coffee, Tv } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { BookingForm } from "./BookingForm";

interface RoomCardProps {
  name: string;
  description: string;
  capacity: number;
  image_url: string; // Changed from imageUrl to match Supabase schema
  amenities: string[];
}

export function RoomCard({ name, description, capacity, image_url, amenities }: RoomCardProps) {
  console.log("RoomCard rendering for:", name);
  
  const amenityIcons = {
    wifi: <Wifi className="amenity-icon" aria-label="WiFi available" />,
    coffee: <Coffee className="amenity-icon" aria-label="Coffee machine available" />,
    tv: <Tv className="amenity-icon" aria-label="TV/Display available" />
  };

  return (
    <Card className="room-card overflow-hidden" role="article" aria-label={`Meeting room: ${name}`}>
      <div className="aspect-video relative overflow-hidden">
        <img
          src={image_url}
          alt={`Interior view of ${name}`}
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            console.error("Image failed to load for room:", name);
            e.currentTarget.src = "/placeholder.svg";
          }}
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{name}</h3>
            <p className="text-sm text-gray-600">{description}</p>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            <Users className="w-4 h-4 mr-1" aria-hidden="true" />
            <span aria-label={`Capacity: ${capacity} people`}>{capacity}</span>
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2" role="list" aria-label="Room amenities">
          {amenities.map((amenity) => {
            console.log("Rendering amenity:", amenity, "for room:", name);
            return (
              <div 
                key={amenity} 
                className="flex items-center gap-1"
                role="listitem"
              >
                {amenityIcons[amenity as keyof typeof amenityIcons]}
              </div>
            );
          })}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Sheet>
          <SheetTrigger asChild>
            <Button aria-label={`Book ${name}`}>Book Now</Button>
          </SheetTrigger>
          <SheetContent className="overflow-y-auto">
            <BookingForm roomName={name} capacity={capacity} />
          </SheetContent>
        </Sheet>
      </CardFooter>
    </Card>
  );
}
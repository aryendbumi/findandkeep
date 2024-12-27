import { Calendar, Users, Wifi, Coffee, Tv } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { BookingForm } from "./BookingForm";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

interface RoomCardProps {
  name: string;
  description: string;
  capacity: number;
  imageUrl: string;
  amenities: string[];
}

export function RoomCard({ name, description, capacity, imageUrl, amenities }: RoomCardProps) {
  const amenityIcons = {
    wifi: <Wifi className="amenity-icon" />,
    coffee: <Coffee className="amenity-icon" />,
    tv: <Tv className="amenity-icon" />
  };

  return (
    <Card className="room-card overflow-hidden">
      <div className="aspect-video relative overflow-hidden">
        <img
          src={imageUrl}
          alt={name}
          className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
        />
      </div>
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-semibold">{name}</h3>
            <p className="text-sm text-muted-foreground">{description}</p>
          </div>
          <Badge variant="secondary">
            <Users className="w-4 h-4 mr-1" />
            {capacity}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2">
          {amenities.map((amenity) => (
            <div key={amenity} className="flex items-center gap-1">
              {amenityIcons[amenity as keyof typeof amenityIcons]}
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter className="flex justify-end">
        <Sheet>
          <SheetTrigger asChild>
            <Button>Book Now</Button>
          </SheetTrigger>
          <SheetContent className="overflow-y-auto">
            <BookingForm roomName={name} capacity={capacity} />
          </SheetContent>
        </Sheet>
      </CardFooter>
    </Card>
  );
}
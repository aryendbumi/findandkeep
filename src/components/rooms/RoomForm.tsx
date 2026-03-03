import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const COMMON_AMENITIES = [
  "Projector", "Whiteboard", "Video Conference", "TV Screen",
  "Phone", "WiFi", "Air Conditioning", "Microphone",
  "Speaker", "Webcam", "Flip Chart", "Power Outlets",
];

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  location: z.string().optional(),
  capacity: z.number().min(1, "Capacity must be at least 1"),
});

export type RoomFormData = z.infer<typeof formSchema> & { amenities: string[] };

interface RoomFormProps {
  defaultValues: RoomFormData;
  onSubmit: (values: RoomFormData, photoFile?: File | null) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  currentPhotoUrl?: string | null;
}

export function RoomForm({ defaultValues, onSubmit, onCancel, isSubmitting, currentPhotoUrl }: RoomFormProps) {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: defaultValues.name,
      location: defaultValues.location || "",
      capacity: defaultValues.capacity,
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(currentPhotoUrl || null);
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>(defaultValues.amenities || []);
  const [customAmenity, setCustomAmenity] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]
    );
  };

  const addCustomAmenity = () => {
    const trimmed = customAmenity.trim();
    if (trimmed && !selectedAmenities.includes(trimmed)) {
      setSelectedAmenities((prev) => [...prev, trimmed]);
      setCustomAmenity("");
    }
  };

  const handleFormSubmit = (vals: z.infer<typeof formSchema>) => {
    onSubmit({ ...vals, amenities: selectedAmenities }, photoFile);
  };

  return (
    <ScrollArea className="max-h-[70vh] pr-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 pb-2">
          {/* Photo upload */}
          <div>
            <label className="text-sm font-medium">Room Photo</label>
            <div
              className="mt-1 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              {photoPreview ? (
                <img src={photoPreview} alt="Room preview" className="mx-auto max-h-32 rounded object-cover" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImagePlus className="h-8 w-8" />
                  <span className="text-sm">Click to upload photo</span>
                </div>
              )}
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>
          </div>

          <FormField control={form.control} name="name" render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl><Input {...field} placeholder="Enter room name" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="location" render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl><Input {...field} placeholder="e.g. Floor 3, Building A" /></FormControl>
              <FormMessage />
            </FormItem>
          )} />

          <FormField control={form.control} name="capacity" render={({ field }) => (
            <FormItem>
              <FormLabel>Capacity</FormLabel>
              <FormControl>
                <Input {...field} type="number" min={1} onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 1)} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} />

          {/* Amenities pill toggles */}
          <div>
            <label className="text-sm font-medium">Amenities</label>
            <div className="flex flex-wrap gap-2 mt-2">
              {COMMON_AMENITIES.map((amenity) => (
                <Badge
                  key={amenity}
                  variant={selectedAmenities.includes(amenity) ? "default" : "outline"}
                  className="cursor-pointer select-none transition-colors"
                  onClick={() => toggleAmenity(amenity)}
                >
                  {amenity}
                </Badge>
              ))}
              {/* Custom amenities not in common list */}
              {selectedAmenities
                .filter((a) => !COMMON_AMENITIES.includes(a))
                .map((amenity) => (
                  <Badge
                    key={amenity}
                    variant="default"
                    className="cursor-pointer select-none transition-colors"
                    onClick={() => toggleAmenity(amenity)}
                  >
                    {amenity} ×
                  </Badge>
                ))}
            </div>
            <div className="flex gap-2 mt-2">
              <Input
                value={customAmenity}
                onChange={(e) => setCustomAmenity(e.target.value)}
                placeholder="Add custom amenity"
                className="text-sm"
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addCustomAmenity(); } }}
              />
              <Button type="button" variant="outline" size="sm" onClick={addCustomAmenity}>Add</Button>
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Room"}</Button>
          </div>
        </form>
      </Form>
    </ScrollArea>
  );
}

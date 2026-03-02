import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImagePlus } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  capacity: z.number().min(1, "Capacity must be at least 1"),
  amenities: z.string(),
});

export type RoomFormData = z.infer<typeof formSchema>;

interface RoomFormProps {
  defaultValues: RoomFormData;
  onSubmit: (values: RoomFormData, photoFile?: File | null) => void;
  onCancel: () => void;
  isSubmitting?: boolean;
  currentPhotoUrl?: string | null;
}

export function RoomForm({ defaultValues, onSubmit, onCancel, isSubmitting, currentPhotoUrl }: RoomFormProps) {
  const form = useForm<RoomFormData>({
    resolver: zodResolver(formSchema),
    defaultValues,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(currentPhotoUrl || null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      setPhotoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((vals) => onSubmit(vals, photoFile))} className="space-y-4">
        {/* Photo upload */}
        <div>
          <label className="text-sm font-medium">Room Photo</label>
          <div
            className="mt-1 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary transition-colors"
            onClick={() => fileInputRef.current?.click()}
          >
            {photoPreview ? (
              <img src={photoPreview} alt="Room preview" className="mx-auto max-h-40 rounded object-cover" />
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

        <FormField control={form.control} name="description" render={({ field }) => (
          <FormItem>
            <FormLabel>Description</FormLabel>
            <FormControl><Textarea {...field} placeholder="Enter room description" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="capacity" render={({ field }) => (
          <FormItem>
            <FormLabel>Capacity</FormLabel>
            <FormControl>
              <Input {...field} type="number" min={1} onChange={(e) => field.onChange(parseInt(e.target.value, 10))} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <FormField control={form.control} name="amenities" render={({ field }) => (
          <FormItem>
            <FormLabel>Amenities (comma-separated)</FormLabel>
            <FormControl><Input {...field} placeholder="Projector, Whiteboard, Video Conference" /></FormControl>
            <FormMessage />
          </FormItem>
        )} />

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>Cancel</Button>
          <Button type="submit" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Room"}</Button>
        </div>
      </form>
    </Form>
  );
}

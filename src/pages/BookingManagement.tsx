import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Edit } from "lucide-react";
import { format } from "date-fns";

interface BookingRow {
  id: string;
  title: string;
  description: string | null;
  room_id: number;
  user_id: string;
  start_time: string;
  end_time: string;
  priority: string | null;
  created_at: string;
}

export default function BookingManagement() {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [editingBooking, setEditingBooking] = useState<BookingRow | null>(null);
  const [editForm, setEditForm] = useState({ title: "", description: "", priority: "medium" });

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["all-bookings-admin"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("bookings")
        .select("*")
        .order("start_time", { ascending: false });
      if (error) throw error;

      // Fetch room names and user names
      const roomIds = [...new Set(data.map((b: BookingRow) => b.room_id))];
      const userIds = [...new Set(data.map((b: BookingRow) => b.user_id))];

      const { data: rooms } = await supabase.from("rooms").select("id, name").in("id", roomIds);
      const { data: profiles } = await supabase.from("profile_directory").select("id, first_name, last_name").in("id", userIds);

      const roomMap = new Map((rooms ?? []).map((r: any) => [r.id, r.name]));
      const profileMap = new Map((profiles ?? []).map((p: any) => [p.id, `${p.first_name || ""} ${p.last_name || ""}`.trim() || "Unknown"]));

      return data.map((b: BookingRow) => ({
        ...b,
        roomName: roomMap.get(b.room_id) || "Unknown Room",
        userName: profileMap.get(b.user_id) || "Unknown User",
      }));
    },
    enabled: user?.role === "superadmin",
  });

  const deleteMutation = useMutation({
    mutationFn: async (bookingId: string) => {
      const { error } = await supabase.from("bookings").delete().eq("id", bookingId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-bookings-admin"] });
      queryClient.invalidateQueries({ queryKey: ["all-bookings"] });
      queryClient.invalidateQueries({ queryKey: ["room-bookings"] });
      toast({ title: "Deleted", description: "Booking deleted successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete booking.", variant: "destructive" });
    },
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, title, description, priority }: { id: string; title: string; description: string; priority: string }) => {
      const { error } = await supabase.from("bookings").update({ title, description, priority }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-bookings-admin"] });
      queryClient.invalidateQueries({ queryKey: ["all-bookings"] });
      setEditingBooking(null);
      toast({ title: "Updated", description: "Booking updated successfully." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update booking.", variant: "destructive" });
    },
  });

  const openEdit = (b: any) => {
    setEditingBooking(b);
    setEditForm({ title: b.title, description: b.description || "", priority: b.priority || "medium" });
  };

  if (user?.role !== "superadmin") {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card><CardContent className="py-8"><p className="text-center text-muted-foreground">You do not have permission to access this page.</p></CardContent></Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Booking Management</h1>
        <p className="text-muted-foreground">View, edit, or delete any booking across all users.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Bookings</CardTitle>
          <CardDescription>{bookings.length} total bookings</CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Loading bookings...</div>
          ) : bookings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No bookings found.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Room</TableHead>
                    <TableHead>Booked By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Time</TableHead>
                    <TableHead>Priority</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {bookings.map((b: any) => (
                    <TableRow key={b.id}>
                      <TableCell className="font-medium">{b.title}</TableCell>
                      <TableCell>{b.roomName}</TableCell>
                      <TableCell>{b.userName}</TableCell>
                      <TableCell>{format(new Date(b.start_time), "MMM d, yyyy")}</TableCell>
                      <TableCell>{format(new Date(b.start_time), "HH:mm")} - {format(new Date(b.end_time), "HH:mm")}</TableCell>
                      <TableCell className="capitalize">{b.priority || "medium"}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(b)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon"><Trash2 className="h-4 w-4" /></Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Booking</AlertDialogTitle>
                                <AlertDialogDescription>Are you sure you want to delete "{b.title}"? This cannot be undone.</AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => deleteMutation.mutate(b.id)} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={!!editingBooking} onOpenChange={(open) => !open && setEditingBooking(null)}>
        <DialogContent>
          <DialogHeader><DialogTitle>Edit Booking</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Title</Label>
              <Input value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })} />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} />
            </div>
            <div>
              <Label>Priority</Label>
              <Select value={editForm.priority} onValueChange={(v) => setEditForm({ ...editForm, priority: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setEditingBooking(null)}>Cancel</Button>
              <Button disabled={updateMutation.isPending} onClick={() => editingBooking && updateMutation.mutate({ id: editingBooking.id, ...editForm })}>
                {updateMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

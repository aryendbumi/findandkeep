import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, UserCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Index from "./pages/Index";
import MyBookings from "./pages/MyBookings";
import BookedRooms from "./pages/BookedRooms";
import MyAccount from "./pages/MyAccount";
import RoomManagement from "./pages/RoomManagement";

const queryClient = new QueryClient();

// Mock user data - replace with actual auth
const user = {
  name: "John Doe",
  role: "Super Admin" // or "Meeting Organizer"
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen flex flex-col">
          <header className="bg-white border-b sticky top-0 z-50">
            <div className="container mx-auto px-4 py-4">
              <div className="flex justify-between items-center">
                <div className="flex gap-4">
                  <Link to="/" className="text-sm font-medium hover:text-primary">
                    Available Rooms
                  </Link>
                  <Link to="/booked-rooms" className="text-sm font-medium hover:text-primary">
                    Booked Rooms
                  </Link>
                  <Link to="/my-bookings" className="text-sm font-medium hover:text-primary">
                    My Bookings
                  </Link>
                  {user.role === "Super Admin" && (
                    <Link to="/room-management" className="text-sm font-medium hover:text-primary">
                      Room Management
                    </Link>
                  )}
                </div>
                
                {/* User Info - Desktop */}
                <div className="hidden md:flex items-center gap-4">
                  <span className="text-sm">
                    Hey, {user.name}! You're a {user.role}.
                  </span>
                  <Link to="/my-account">
                    <Button variant="ghost" size="icon">
                      <UserCircle className="h-5 w-5" />
                    </Button>
                  </Link>
                </div>

                {/* User Info - Mobile */}
                <div className="md:hidden">
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <Menu className="h-5 w-5" />
                      </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <div className="py-4">
                        <p className="text-sm">
                          Hey, {user.name}!
                        </p>
                        <p className="text-sm text-muted-foreground">
                          You're a {user.role}
                        </p>
                        <div className="mt-4">
                          <Link to="/my-account" className="text-sm font-medium hover:text-primary block py-2">
                            My Account
                          </Link>
                          {user.role === "Super Admin" && (
                            <Link to="/room-management" className="text-sm font-medium hover:text-primary block py-2">
                              Room Management
                            </Link>
                          )}
                        </div>
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>
            </div>
          </header>

          <main className="flex-1">
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/my-bookings" element={<MyBookings />} />
              <Route path="/booked-rooms" element={<BookedRooms />} />
              <Route path="/my-account" element={<MyAccount />} />
              <Route path="/room-management" element={<RoomManagement />} />
            </Routes>
          </main>

          <footer className="bg-white border-t py-6">
            <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
              Fachry Nuzuli. All Rights Reserved.
            </div>
          </footer>
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
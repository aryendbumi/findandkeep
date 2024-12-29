import { useEffect, useState } from "react";
import { Routes, Route, Link, useNavigate } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, UserCircle, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import MyBookings from "@/pages/MyBookings";
import BookedRooms from "@/pages/BookedRooms";
import MyAccount from "@/pages/MyAccount";
import RoomManagement from "@/pages/RoomManagement";
import AvailableRooms from "@/pages/AvailableRooms";
import RoomTimeline from "@/components/RoomTimeline";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/login");
      }
      setLoading(false);
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!session) {
        navigate("/login");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export const AppContent = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (currentUser) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', currentUser.id)
          .single();
        
        setUser(profile);
      }
    };

    fetchUser();
  }, []);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    } else {
      navigate("/");
    }
  };

  if (!user) return null;

  const DashboardHome = () => (
    <div className="space-y-6">
      <div className="border-b pb-4">
        <RoomTimeline />
      </div>
      <AvailableRooms />
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              <Link to="/dashboard" className="text-sm font-medium hover:text-primary">
                Available Rooms
              </Link>
              <Link to="/dashboard/booked-rooms" className="text-sm font-medium hover:text-primary">
                Booked Rooms
              </Link>
              <Link to="/dashboard/my-bookings" className="text-sm font-medium hover:text-primary">
                My Bookings
              </Link>
              {user.role === "Super Admin" && (
                <Link to="/dashboard/room-management" className="text-sm font-medium hover:text-primary">
                  Room Management
                </Link>
              )}
            </div>
            
            {/* User Info - Desktop */}
            <div className="hidden md:flex items-center gap-4">
              <span className="text-sm">
                Hey, {user.first_name || user.email}! You're a {user.role}.
              </span>
              <Link to="/dashboard/my-account">
                <Button variant="ghost" size="icon">
                  <UserCircle className="h-5 w-5" />
                </Button>
              </Link>
              <Button variant="ghost" size="icon" onClick={handleLogout}>
                <LogOut className="h-5 w-5" />
              </Button>
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
                      Hey, {user.first_name || user.email}!
                    </p>
                    <p className="text-sm text-muted-foreground">
                      You're a {user.role}
                    </p>
                    <div className="mt-4">
                      <Link to="/dashboard/my-account" className="text-sm font-medium hover:text-primary block py-2">
                        My Account
                      </Link>
                      {user.role === "Super Admin" && (
                        <Link to="/dashboard/room-management" className="text-sm font-medium hover:text-primary block py-2">
                          Room Management
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="text-sm font-medium hover:text-primary block py-2 w-full text-left"
                      >
                        Sign Out
                      </button>
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
          <Route path="/" element={<DashboardHome />} />
          <Route path="/my-bookings" element={<MyBookings />} />
          <Route path="/booked-rooms" element={<BookedRooms />} />
          <Route path="/my-account" element={<MyAccount />} />
          <Route path="/room-management" element={<RoomManagement />} />
        </Routes>
      </main>
    </div>
  );
};
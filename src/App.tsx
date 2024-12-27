import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Index from "./pages/Index";
import MyBookings from "./pages/MyBookings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <nav className="bg-white border-b">
          <div className="container mx-auto px-4 py-4">
            <div className="flex gap-4">
              <Link to="/" className="text-sm font-medium hover:text-primary">
                Available Rooms
              </Link>
              <Link to="/my-bookings" className="text-sm font-medium hover:text-primary">
                My Bookings
              </Link>
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/my-bookings" element={<MyBookings />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
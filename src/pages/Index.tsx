import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, Users } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";
import { toast } from "@/components/ui/use-toast";

const Index = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setIsAuthenticated(!!session);
      } catch (error) {
        console.error("Error checking auth status:", error);
        toast({
          title: "Error",
          description: "Failed to check authentication status",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-20 pb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900 tracking-tight mb-6">
          Find 'N Keep
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-12">
          Simplify your meeting room bookings. The smart way to manage your workspace.
        </p>
        <Button
          size="lg"
          onClick={handleGetStarted}
          className="text-lg px-8 py-6 h-auto gap-3"
          disabled={isLoading}
        >
          {isLoading ? "Loading..." : isAuthenticated ? "View Available Rooms" : "Get Started Now"}
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <Calendar className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-3">Quick Booking</h3>
            <p className="text-gray-600">
              Book meeting rooms in seconds with our intuitive interface.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <Clock className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-3">Real-time Availability</h3>
            <p className="text-gray-600">
              See room availability instantly and avoid scheduling conflicts.
            </p>
          </div>
          <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
            <Users className="w-12 h-12 text-primary mb-4" />
            <h3 className="text-xl font-semibold mb-3">Team Coordination</h3>
            <p className="text-gray-600">
              Coordinate with your team effortlessly for better collaboration.
            </p>
          </div>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold mb-12">Why Choose Find 'N Keep?</h2>
        <div className="max-w-3xl mx-auto space-y-6 text-gray-600">
          <p className="text-lg">
            ✨ Save time with our streamlined booking process
          </p>
          <p className="text-lg">
            📊 Optimize your workspace utilization
          </p>
          <p className="text-lg">
            🤝 Enhance team collaboration and meeting management
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-20">
        <div className="container mx-auto px-4 py-8 text-center text-gray-600">
          <p>© {new Date().getFullYear()} Find 'N Keep. All rights reserved.</p>
          <p className="mt-2 text-sm">Created by Fachry</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Clock, Users, Shield, Zap, Globe } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const Logo = () => (
  <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg" className="animate-float">
    <rect width="40" height="40" rx="12" fill="url(#logo_grad)" />
    <path d="M12 20C12 15.5817 15.5817 12 20 12C24.4183 12 28 15.5817 28 20V28H12V20Z" fill="white" fillOpacity="0.2" />
    <circle cx="20" cy="20" r="6" stroke="white" strokeWidth="2.5" />
    <path d="M20 14V17" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <path d="M26 20H23" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <path d="M20 26V23" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <path d="M14 20H17" stroke="white" strokeWidth="2" strokeLinecap="round" />
    <defs>
      <linearGradient id="logo_grad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
        <stop stopColor="#6366F1" />
        <stop offset="1" stopColor="#A855F7" />
      </linearGradient>
    </defs>
  </svg>
);

const FeatureIcon = ({ icon: Icon, color }: { icon: any, color: string }) => (
  <div className="relative group">
    <div className={`absolute -inset-2 bg-gradient-to-r ${color} rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-500`}></div>
    <div className="relative flex items-center justify-center w-12 h-12 bg-white rounded-xl shadow-sm border border-gray-100">
      <Icon className="w-6 h-6 text-gray-700" />
    </div>
  </div>
);

const Index = () => {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-mesh font-sans selection:bg-indigo-100 selection:text-indigo-900 overflow-x-hidden">
      {/* Decorative Blobs */}
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-[120px] animate-pulse-glow"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[35%] h-[35%] bg-purple-200/30 rounded-full blur-[120px] animate-pulse-glow" style={{ animationDelay: '-1.5s' }}></div>
      </div>

      {/* Navigation */}
      <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 w-[min(90%,1200px)]">
        <div className="glass-morphism rounded-full px-6 py-3 flex items-center justify-between shadow-lg shadow-indigo-500/5">
          <div className="flex items-center gap-3">
            <Logo />
            <span className="text-xl font-bold tracking-tight text-gray-900">Find 'N Keep</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" className="hidden md:flex rounded-full px-6" onClick={() => navigate("/login")}>
              Sign In
            </Button>
            <Button size="sm" className="rounded-full px-6 shadow-md shadow-indigo-200" onClick={handleGetStarted}>
              Get Started
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="container mx-auto px-4 pt-48 pb-20 relative">
        <div className="max-w-4xl mx-auto text-center animate-fade-in-up">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-600 text-sm font-medium mb-8">
            <Zap className="w-4 h-4 fill-current" />
            <span>The newest way to book meeting rooms</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-bold text-gray-900 tracking-tight mb-8 leading-[1.1]">
            Simplify your <span className="text-indigo-600">workspace</span> bookings.
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto mb-12 leading-relaxed">
            Find 'N Keep helps teams organize their meetings without the headache of scheduling conflicts. Smart, simple, and beautifully designed.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="group relative overflow-hidden text-lg px-8 py-7 h-auto gap-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-200 transition-all duration-300 active:scale-95"
              disabled={isLoading}
            >
              <div className="absolute inset-0 w-1/2 h-full bg-white/20 -skew-x-[45deg] animate-shine -z-0"></div>
              <span className="relative z-10 flex items-center gap-2">
                {isLoading ? "Loading..." : isAuthenticated ? "Dashboard" : "Start Booking for Free"}
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </span>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 py-7 h-auto rounded-2xl border-2 hover:bg-gray-50">
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Mockup Section */}
        <div className="mt-24 max-w-5xl mx-auto animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-[2.5rem] blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
            <div className="relative bg-white border border-gray-200 rounded-[2rem] shadow-2xl overflow-hidden aspect-video">
              {/* Fake Dashboard Header */}
              <div className="h-12 border-b border-gray-100 bg-gray-50/50 flex items-center px-6 gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="ml-4 w-48 h-6 rounded-lg bg-gray-200/50"></div>
              </div>
              {/* Fake Dashboard Content */}
              <div className="p-8 grid grid-cols-12 gap-6 h-full">
                <div className="col-span-3 space-y-4">
                  <div className="h-32 rounded-2xl bg-indigo-50/50 border border-indigo-100/50"></div>
                  <div className="h-8 rounded-xl bg-gray-100"></div>
                  <div className="h-8 rounded-xl bg-gray-100"></div>
                  <div className="h-8 rounded-xl bg-gray-100"></div>
                </div>
                <div className="col-span-9 space-y-6">
                  <div className="h-12 rounded-2xl bg-gray-100"></div>
                  <div className="grid grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="aspect-square rounded-2xl bg-gray-50 border border-gray-100 animate-pulse" style={{ animationDelay: `${i * 0.1}s` }}></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features Grid */}
      <section className="container mx-auto px-4 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-gray-900 mb-4">Built for modern teams</h2>
            <p className="text-lg text-gray-600">Everything you need to manage your workspace efficiently.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                icon: Calendar,
                title: "Quick Booking",
                desc: "Book meeting rooms in seconds with our intuitive interface.",
                color: "from-blue-400 to-indigo-400"
              },
              {
                icon: Clock,
                title: "Real-time Status",
                desc: "See room availability instantly and avoid scheduling conflicts.",
                color: "from-indigo-400 to-purple-400"
              },
              {
                icon: Users,
                title: "Team Sync",
                desc: "Coordinate with your team effortlessly for better collaboration.",
                color: "from-purple-400 to-pink-400"
              }
            ].map((f, i) => (
              <div key={i} className="group p-8 rounded-[2rem] bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:shadow-indigo-500/5 hover:-translate-y-1 transition-all duration-300">
                <FeatureIcon icon={f.icon} color={f.color} />
                <h3 className="text-xl font-bold mt-6 mb-3 text-gray-900">{f.title}</h3>
                <p className="text-gray-600 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats / Trust Section */}
      <section className="container mx-auto px-4 py-24 border-y border-gray-100 bg-gray-50/30">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-5xl mx-auto text-center">
          <div>
            <Shield className="w-8 h-8 text-indigo-600 mx-auto mb-4" />
            <div className="text-4xl font-bold text-gray-900 mb-1">99.9%</div>
            <div className="text-gray-500 font-medium">Uptime Reliable</div>
          </div>
          <div>
            <Globe className="w-8 h-8 text-indigo-600 mx-auto mb-4" />
            <div className="text-4xl font-bold text-gray-900 mb-1">2,000+</div>
            <div className="text-gray-500 font-medium">Teams Using It</div>
          </div>
          <div>
            <Zap className="w-8 h-8 text-indigo-600 mx-auto mb-4" />
            <div className="text-4xl font-bold text-gray-900 mb-1">2.4s</div>
            <div className="text-gray-500 font-medium">Avg. Booking Time</div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="container mx-auto px-4 py-32">
        <div className="max-w-4xl mx-auto relative rounded-[3rem] p-12 md:p-20 overflow-hidden text-center bg-indigo-900">
          <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/20 blur-[80px] -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/20 blur-[80px] -ml-32 -mb-32"></div>

          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-8">Ready to transform your workspace?</h2>
            <p className="text-indigo-100 text-lg mb-12 max-w-xl mx-auto opacity-80">
              Join thousands of teams who have already simplified their meeting room management.
            </p>
            <Button
              size="lg"
              onClick={handleGetStarted}
              className="text-lg px-10 py-7 h-auto gap-3 rounded-2xl bg-white text-indigo-600 hover:bg-gray-100 shadow-xl"
            >
              Get Started for Free
              <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-100 py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center gap-3">
              <Logo />
              <span className="text-xl font-bold tracking-tight text-gray-900">Find 'N Keep</span>
            </div>
            <div className="text-gray-500 font-medium">
              © {new Date().getFullYear()} Find 'N Keep. All rights reserved.
            </div>
            <div className="flex items-center gap-6">
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">Twitter</a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">LinkedIn</a>
              <a href="#" className="text-gray-400 hover:text-indigo-600 transition-colors">GitHub</a>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-50 text-center text-sm text-gray-400">
            Created with Passion by Fachry
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;


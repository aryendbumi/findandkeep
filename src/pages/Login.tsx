import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Confetti } from "@/components/ui/confetti";
import { useRef } from "react";
import type { ConfettiRef } from "@/components/ui/confetti";

const Login = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<"sign-in" | "sign-up">("sign-in");
  const confettiRef = useRef<ConfettiRef>(null);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        if (event === 'SIGNED_UP') {
          confettiRef.current?.fire({
            spread: 360,
            startVelocity: 30,
            elementCount: 150,
            decay: 0.95
          });
          // Give time for confetti before navigation
          setTimeout(() => navigate("/"), 1500);
        } else {
          navigate("/");
        }
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  useEffect(() => {
    const setupPasswordToggles = () => {
      const passwordInputs = document.querySelectorAll('input[type="password"]');
      passwordInputs.forEach(input => {
        if (input instanceof HTMLInputElement && !input.dataset.hasToggle) {
          input.dataset.hasToggle = 'true';
          
          let wrapper = input.parentElement;
          if (!wrapper?.classList.contains('password-wrapper')) {
            wrapper = document.createElement('div');
            wrapper.className = 'password-wrapper relative';
            input.parentElement?.insertBefore(wrapper, input);
            wrapper.appendChild(input);
          }
          
          const toggleButton = document.createElement('button');
          toggleButton.type = 'button';
          toggleButton.className = 'absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md hover:bg-accent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary';
          
          const updateIcon = (showPassword: boolean) => {
            toggleButton.innerHTML = showPassword 
              ? '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>'
              : '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>';
          };
          
          updateIcon(false);
          wrapper.appendChild(toggleButton);
          
          toggleButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            const newType = input.type === 'password' ? 'text' : 'password';
            input.type = newType;
            updateIcon(newType === 'text');
          });
        }
      });
    };

    setTimeout(setupPasswordToggles, 500);

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.addedNodes.length) {
          setTimeout(setupPasswordToggles, 100);
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
          Find And Keep Your Room, Now
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {view === "sign-in" ? "Sign in to your account" : "Create your account"}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-card py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Auth
            supabaseClient={supabase}
            view={view}
            appearance={{ 
              theme: ThemeSupa,
              style: {
                button: { 
                  background: 'hsl(var(--primary))',
                  color: 'hsl(var(--primary-foreground))',
                  borderRadius: 'var(--radius)',
                },
                anchor: { color: 'hsl(var(--primary))' },
                container: { width: '100%' },
                input: { 
                  borderRadius: 'var(--radius)',
                  borderColor: 'hsl(var(--border))',
                  backgroundColor: 'hsl(var(--background))',
                },
                message: { color: 'hsl(var(--destructive))' },
                divider: { backgroundColor: 'hsl(var(--border))' },
                label: { color: 'hsl(var(--foreground))' },
              }
            }}
            theme="default"
            providers={[]}
            redirectTo={window.location.origin}
            onViewChange={(newView) => {
              setView(newView === 'sign_in' ? 'sign-in' : 'sign-up');
            }}
          />
        </div>
      </div>
      
      <Confetti
        ref={confettiRef}
        className="fixed inset-0 pointer-events-none"
        manualstart={true}
      />
    </div>
  );
};

export default Login;
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();
  const [view, setView] = useState<"sign_in" | "sign_up">("sign_in");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          navigate("/");
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
      } finally {
        setIsLoading(false);
      }
    };

    checkUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        navigate("/");
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-foreground">
          Find And Keep Your Room, Now
        </h2>
        <p className="mt-2 text-center text-sm text-muted-foreground">
          {view === "sign_in" ? "Sign in to your account" : "Create your account"}
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
                  padding: '0.5rem 1rem',
                  height: '2.5rem',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                },
                anchor: { 
                  color: 'hsl(var(--primary))',
                  fontSize: '0.875rem',
                },
                container: { 
                  width: '100%',
                },
                input: { 
                  borderRadius: 'var(--radius)',
                  borderColor: 'hsl(var(--border))',
                  backgroundColor: 'hsl(var(--background))',
                  height: '2.5rem',
                  fontSize: '0.875rem',
                },
                message: { 
                  color: 'hsl(var(--destructive))',
                  fontSize: '0.875rem',
                  marginTop: '0.25rem',
                },
                divider: { 
                  backgroundColor: 'hsl(var(--border))',
                  margin: '1.5rem 0',
                },
                label: { 
                  color: 'hsl(var(--foreground))',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  marginBottom: '0.25rem',
                },
              }
            }}
            localization={{
              variables: {
                sign_in: {
                  email_label: 'Email address',
                  password_label: 'Password',
                },
                sign_up: {
                  email_label: 'Email address',
                  password_label: 'Create a password',
                },
              },
            }}
            theme="default"
            providers={[]}
            redirectTo={window.location.origin}
            onError={(error) => {
              if (error.message.includes("User already registered")) {
                toast.error("This email is already registered. Please sign in instead.");
                setView("sign_in");
              } else {
                toast.error(error.message);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default Login;
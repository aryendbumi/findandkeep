import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/integrations/supabase/client";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";

const Login = () => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        navigate("/");
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

  // Override the default Auth UI styles to add the password toggle
  const customTheme = {
    ...ThemeSupa,
    default: {
      ...ThemeSupa.default,
      colors: {
        ...ThemeSupa.default.colors,
        brandAccent: 'rgb(var(--primary))',
      },
    },
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
          Welcome to MeetSpace
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Sign in to your account to continue
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Auth
            supabaseClient={supabase}
            appearance={{ 
              theme: customTheme,
              style: {
                button: { background: 'rgb(var(--primary))', color: 'white' },
                anchor: { color: 'rgb(var(--primary))' },
                container: { width: '100%' },
                input: { borderRadius: '0.375rem' },
                message: { color: 'rgb(var(--destructive))' },
              },
              className: {
                container: 'relative',
                password: 'relative',
              }
            }}
            theme="light"
            providers={[]}
            redirectTo={window.location.origin}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute right-12 top-[215px] hover:bg-transparent"
            onClick={() => {
              // Find the password input and toggle its type
              const passwordInput = document.querySelector('input[type="password"]');
              if (passwordInput) {
                passwordInput.type = showPassword ? 'password' : 'text';
                setShowPassword(!showPassword);
              }
            }}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 text-gray-500" />
            ) : (
              <Eye className="h-4 w-4 text-gray-500" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Login;
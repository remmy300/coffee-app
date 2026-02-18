import { Button } from "@/components/ui/button";

const Login = () => {
  const handleGoogleLogin = () => {
    window.location.href =
      import.meta.env.VITE_API_URL + "/api/admin/auth/google";
  };

  return (
    <div className="flex items-center justify-center min-h-screen ">
      <Button onClick={handleGoogleLogin}>Sign in with Google</Button>
    </div>
  );
};

export default Login;

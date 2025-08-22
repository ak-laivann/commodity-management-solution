import { useState, useContext } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useMutateData } from "@/hooks/useMutation";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";
import { UserRole, type User } from "@/components/props";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [signinMethod, setSigninMethod] = useState<
    "signup" | "login" | "google" | "facebook"
  >("signup");

  const { setUser } = useContext(UserContext);
  const navigate = useNavigate();

  const mutation = useMutateData<User, {}>(
    `/api/v1/auth/login?signinMethod=${signinMethod}`,
    {
      onSuccess: (data) => {
        setUser?.({
          id: data.id,
          name: data.name,
          email: data.email,
          role: UserRole.Manager,
          isSignedIn: true,
          managerId: data.managerId,
        });
        navigate("/dashboard");
      },
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSigninMethod(isLogin ? "login" : "signup");
    mutation.mutate({ email, password });
  };

  const handleSocialSignIn = (method: "google" | "facebook") => {
    setSigninMethod(method);
    mutation.mutate({});
  };

  return (
    <div className="flex min-h-screen">
      <div className="flex flex-col justify-center items-center w-2/3 p-8">
        <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4">
          <h1 className="text-3xl font-bold text-center mb-4">
            {isLogin ? "Login to Your Account" : "Create an Account"}
          </h1>

          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button
            type="submit"
            className="w-full"
            disabled={mutation.isPending}
          >
            {mutation.isPending
              ? isLogin
                ? "Logging in..."
                : "Registering..."
              : isLogin
              ? "Login"
              : "Get Started"}
          </Button>

          <div className="flex flex-col space-y-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialSignIn("google")}
            >
              Sign in with Google
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleSocialSignIn("facebook")}
            >
              Sign in with Facebook
            </Button>
          </div>

          <p className="text-center text-sm">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:underline"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </form>
      </div>

      <div className="w-1/3">
        <img
          src="/images/auth-bg.jpg"
          alt="Auth Background"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

import { useState, useContext } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useUserLogin } from "@/hooks";
import { faker } from "@faker-js/faker";
import { useTheme } from "@/context/ThemeContext";
import { AsyncUIWrapper } from "@/components/custom";

export const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(false);
  const [signinMethod, setSigninMethod] = useState<
    "signup" | "login" | "google" | "facebook"
  >("signup");

  const { theme } = useTheme();

  const navigate = useNavigate();
  const loginMutation = useUserLogin(signinMethod, () =>
    navigate("/dashboard")
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSigninMethod(isLogin ? "login" : "signup");
    loginMutation.mutate({ email, password });
  };

  const handleSocialSignIn = (method: "google" | "facebook") => {
    setSigninMethod(method);
    loginMutation.mutate({});
  };

  const bgUrl = theme === "dark" ? "/images/dark.jpg" : "/images/light.jpg";

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
            disabled={loginMutation.isPending}
          >
            {loginMutation.isPending
              ? isLogin
                ? "Logging in..."
                : "Registering..."
              : isLogin
              ? "Login"
              : "Get Started"}
          </Button>
          <div className="flex items-center justify-center">
            <br />
            OR
          </div>
          <br />
          <div className="flex flex-col space-y-3">
            <Button
              disabled={loginMutation.isPending}
              type="button"
              variant="outline"
              onClick={() => handleSocialSignIn("google")}
            >
              Sign in with Google
            </Button>
            <Button
              disabled={loginMutation.isPending}
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
              disabled={loginMutation.isPending}
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-blue-600 hover:underline"
            >
              {isLogin ? "Sign Up" : "Login"}
            </button>
          </p>
        </form>
        <AsyncUIWrapper
          isError={loginMutation.isError}
          isLoading={loginMutation.isPending}
          error={loginMutation.error}
        >
          <></>
        </AsyncUIWrapper>
      </div>

      <div className="w-1/3">
        <img
          src={bgUrl}
          alt="Auth Background"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
};

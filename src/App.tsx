import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RootContainer } from "./container/RootContainer";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { useEffect } from "react";

const queryClient = new QueryClient();

function App() {
  useEffect(() => {
    const html = document.documentElement;
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && e.shiftKey && e.code === "KeyD") {
        html.classList.toggle("dark");
        const isDark = html.classList.contains("dark");
        localStorage.setItem("theme", isDark ? "dark" : "light");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <RootContainer />
        <ToastContainer />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;

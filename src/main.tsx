import { makeServer } from "./mirage";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";

makeServer();

createRoot(document.getElementById("root")!).render(<App />);

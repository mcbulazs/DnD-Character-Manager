import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

const rootElement = document.getElementById("root");

if (!rootElement) {
  console.error("Root element not found");
  throw new Error("Root element not found");
}

createRoot(rootElement).render(
  <StrictMode>
      <App />
  </StrictMode>,
);

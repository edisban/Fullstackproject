/**
 * Application entry point - renders root component with providers.
 * Wraps app with ThemeProvider (Material-UI) and AuthProvider (JWT context).
 */
import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@/theme";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);

import { createRoot } from "react-dom/client";
import { App } from "./App.tsx";
import "./index.css";

import { AuthProvider } from "./context/AuthContext.tsx";
import { IsOnlineProvider } from "./context/isOnlineContext.tsx";

createRoot(document.getElementById("root")!).render(
  <IsOnlineProvider>
    <AuthProvider>
      <App />
    </AuthProvider>
  </IsOnlineProvider>,
);

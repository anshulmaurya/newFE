import { createRoot } from "react-dom/client";
import React from 'react';
import App from "./App";
import "./index.css";
import { ScrollLockProvider } from './components/ui/select';

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ScrollLockProvider>
      <App />
    </ScrollLockProvider>
  </React.StrictMode>
);

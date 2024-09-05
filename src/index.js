import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import "./i18n";

import App from "./app";
// import { Toaster } from "@/components/ui/toaster";
// import { useToast } from "@/hooks/use-toast";

const rootElement = document.getElementById("wp-react-app");

if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <div className="">
      <App />
    </div>
  );
}

import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { EditedNameProvider } from "./components/chat/EditedNameProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
   <EditedNameProvider><App /></EditedNameProvider> 
  </React.StrictMode>
);

import React from "react";
import ReactDOM from "react-dom/client";
import LockedLiquidity from "./LockedLiquidity"; // Correct relative path

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <LockedLiquidity /> {/* Render the LockedLiquidity component */}
  </React.StrictMode>
);
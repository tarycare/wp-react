import React from "react";
import ReactDOM from "react-dom/client"; // Import createRoot from react-dom/client
import "./style.css";

const App = () => {
  return (
    <div className="p-4 bg-orange-500 text-white">
      <h1>We did it🩷</h1>
      <p>Updated to React 18 with createRoot and concurrent rendering</p>
    </div>
  );
};

// Get the DOM element where your app will be rendered
const rootElement = document.getElementById("wp-react-app");

if (rootElement) {
  // Use createRoot instead of ReactDOM.render
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
}

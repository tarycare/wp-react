import React from "react";
import ReactDOM from "react-dom/client"; // Import createRoot from react-dom/client
import "./style.css";

const App = () => {
  return (
    <div className="p-4 bg-blue-500 text-white">
      <h1>Hello, React 18 with Tailwind CSS!</h1>
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

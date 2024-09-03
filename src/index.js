import React from "react";
import ReactDOM from "react-dom/client"; // Import createRoot from react-dom/client
import "./style.css";

const App = () => {
  return (
    <div className="bg-white size-[800px] rounded-md p-2">
      <h1 className="text-2xl font-bold text-center">Hello World</h1>
      <p className="text-center">This is a React app in WordPress</p>
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

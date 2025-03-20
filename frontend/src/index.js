import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import App from "./App"

// Initialize theme
const savedTheme = localStorage.getItem("theme") || "light"
document.documentElement.classList.add(savedTheme)

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { BrowserRouter} from 'react-router-dom'; 
import { ThemeProvider } from "./Context/theme-context.jsx";


createRoot(document.getElementById("root")).render(
  <ThemeProvider storageKey="theme">
      <App />
  </ThemeProvider>
);

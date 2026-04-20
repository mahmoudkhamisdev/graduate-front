import "./globals.css";
import ReactDOM from "react-dom/client";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "./components/Presentation/theme-provider";
import { PresentationProvider } from "./context/presentation-context";
import { AuthProvider } from "./context/AuthContext";
import { APIProvider } from "./context/ApiContext";
import { LanguageProvider } from "./context/TranslationSystem";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  // <React.StrictMode>
  <BrowserRouter>
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      disableTransitionOnChange
    >
      <LanguageProvider>
        <AuthProvider>
          <APIProvider>
            <PresentationProvider>
              <App />
            </PresentationProvider>
          </APIProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </BrowserRouter>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();

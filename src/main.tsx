import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import App from "./App.tsx"; // ← App usado para login/sign_in
import Home from "./pages/Home.tsx";
import HiveApp from "./pages/HiveApp.tsx"; // ← NUEVO: RoomsHive completo
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Router>
      <Routes>
        {/* Pantalla principal */}
        <Route path="/" element={<Home />} />

        {/* Login y Sign In usando tu App.tsx ORIGINAL */}
        <Route path="/login" element={<App page="login" />} />
        <Route path="/sign_in" element={<App page="sign_in" />} />

        {/* Dashboard RoomsHive */}
        <Route path="/dashboard" element={<HiveApp />} />
      </Routes>
    </Router>
  </React.StrictMode>
);

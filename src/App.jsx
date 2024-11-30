import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginComponent from "./pages/auth/loginComponent";
import RegistrationComponent from "./pages/auth/RegistrationComponent"; // Ensure this path is correct
import DashboardComponent from "./pages/dashboard/dashboardComponent"; // Ensure this path is correct"; // Ensure this path is correct
import "./index.css";

function App() {
  return (
    <Router>
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Routes>
          <Route path="/auth" element={<LoginComponent />} />
          <Route path="/register" element={<RegistrationComponent />} />
          <Route path="/dashboard" element={<DashboardComponent />} />
          {/* Add more routes as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;

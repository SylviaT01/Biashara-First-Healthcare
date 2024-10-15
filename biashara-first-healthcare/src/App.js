import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import RegisterBusiness from "./components/RegisterBusiness";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register-business" element={<RegisterBusiness />} />
       
      </Routes>
    </Router>
  );
}

export default App;

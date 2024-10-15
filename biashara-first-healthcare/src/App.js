import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import LandingPage from "./components/LandingPage";
import RegisterBusiness from "./components/RegisterBusiness";
import Navbar from "./components/NavBar";
import Footer from "./components/Footer";

function AppContent() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register-business" element={<RegisterBusiness />} />
      </Routes>
      </div>
      <Footer />
    </div>
    
  );
}
const App = () => {
  return (
    <Router>
     
        <AppContent />
      
    </Router>
  );
}

export default App;
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import AnalyzeResume from "./pages/AnalyzeResume";
import Results from "./pages/Results"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/analyze" element={<AnalyzeResume />} />
        <Route path="/results" element={<Results />} /> 
      </Routes>
    </Router>
  );
}

export default App;

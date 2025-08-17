// App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import HomePage from "./pages/HomePage";
import Profile from "./pages/Profile";
import AdminPanel from "./pages/AdminPanel"; // додай

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/admin" element={<AdminPanel />} /> {/* новий маршрут */}
      </Routes>
    </Router>
  );
}

export default App;

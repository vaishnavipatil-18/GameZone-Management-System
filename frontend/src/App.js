import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/Dashboard";
import CustomerDashboard from "./pages/customer/Dashboard";
import BookingPage from './pages/customer/BookingPage';
import MyBookings from './pages/customer/MyBookings';
import BrowseGames from './pages/customer/BrowseGames';
import Profile from './pages/customer/Profile';

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Customer Routes */}
        <Route path="/customer/dashboard" element={<CustomerDashboard />} />
        <Route path="/customer/booking" element={<BookingPage />} />
        <Route path="/customer/my-bookings" element={<MyBookings />} />
        <Route path="/customer/browse-games" element={<BrowseGames />} />
        <Route path="/customer/profile" element={<Profile />} />
      </Routes>
    </Router>
  );
}

export default App;

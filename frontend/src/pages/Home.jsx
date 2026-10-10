import React from 'react';
import { Link } from "react-router-dom"; 

import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="nav-brand">
          <h1>GameZone</h1>
        </div>
        <div className="nav-links">
           <Link to="/" className="nav-link active">Home</Link>
           <Link to="/login" className="nav-link">SignIn</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">Welcome To GameZone</h1>
          <p className="hero-description">
            Dive into the latest games, test your skills, and join a community of
            gamers. Epic fun and endless adventures await—let the games begin!
          </p>
          <div className="cta-buttons">
            <button className="cta-button primary">Get Started</button>
            <button className="cta-button secondary">Browse Games</button>
          </div>
        </div>
        
        {/* Hero Visual */}
        <div className="hero-visual">
          <div className="floating-elements">
            <div className="floating-element element-1">
              <i className="fas fa-gamepad"></i>
            </div>
            <div className="floating-element element-2">
              <i className="fas fa-trophy"></i>
            </div>
            <div className="floating-element element-3">
              <i className="fas fa-users"></i>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2>Why Choose GameZone?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <i className="fas fa-gamepad"></i>
            <h3>Latest Games</h3>
            <p>Access to newest releases and classic favorites</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-trophy"></i>
            <h3>Compete & Win</h3>
            <p>Join tournaments and climb the leaderboards</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-users"></i>
            <h3>Community</h3>
            <p>Connect with gamers worldwide</p>
          </div>
          <div className="feature-card">
            <i className="fas fa-bolt"></i>
            <h3>Fast Performance</h3>
            <p>Low latency gaming experience</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="stats-section">
        <div className="stats-container">
          <div className="stat-item">
            <h3>50K+</h3>
            <p>Active Gamers</p>
          </div>
          <div className="stat-item">
            <h3>500+</h3>
            <p>Games Available</p>
          </div>
          <div className="stat-item">
            <h3>24/7</h3>
            <p>Online Support</p>
          </div>
          <div className="stat-item">
            <h3>100+</h3>
            <p>Tournaments</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>GameZone</h3>
            <p>Your ultimate gaming destination</p>
          </div>
          <div className="footer-section">
            <h4>Quick Links</h4>
            <a href="#">Home</a>
            <a href="#">Games</a>
            <a href="#">Tournaments</a>
            <a href="#">Community</a>
          </div>
          <div className="footer-section">
            <h4>Support</h4>
            <a href="#">Help Center</a>
            <a href="#">Contact Us</a>
            <a href="#">FAQ</a>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 GameZone. All rights reserved.</p>
          <div className="social-links">
            <a href="#"><i className="fab fa-discord"></i></a>
            <a href="#"><i className="fab fa-twitter"></i></a>
            <a href="#"><i className="fab fa-youtube"></i></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;
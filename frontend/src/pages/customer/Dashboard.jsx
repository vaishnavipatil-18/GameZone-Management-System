import React from 'react';
import { Link } from 'react-router-dom';

const CustomerDashboard = () => {
  const user = {
    name: "John Doe",
    membership: "Premium",
    membershipExpiry: "2024-12-31",
    loyaltyPoints: 1250
  };

  const stats = [
    { title: "Active Bookings", value: 2, color: "#00ffff" },
    { title: "Games Played", value: 15, color: "#ff00ff" },
    { title: "Loyalty Points", value: user.loyaltyPoints, color: "#00ff00" },
    { title: "Days Left", value: 45, color: "#ffff00" }
  ];

  const quickActions = [
    {
      title: "Browse Games",
      description: "Explore all available games and machines",
      icon: "🎮",
      link: "/customer/browse-games",
      color: "#00ffff"
    },
    {
      title: "Book Game",
      description: "Reserve your gaming session",
      icon: "🕹️",
      link: "/customer/booking",
      color: "#ff00ff"
    },
    {
      title: "My Bookings",
      description: "View and manage your bookings",
      icon: "📅",
      link: "/customer/my-bookings",
      color: "#00ff00"
    },
    {
      title: "Profile & Membership",
      description: "Update profile and membership",
      icon: "⭐",
      link: "/customer/profile",
      color: "#ffff00"
    }
  ];

  const recentActivity = [
    { game: "VR Racing Pro", date: "2024-01-10", time: "14:00", status: "Completed", cost: 25 },
    { game: "Zombie Survival", date: "2024-01-12", time: "16:00", status: "Completed", cost: 30 },
    { game: "Dance Revolution", date: "2024-01-15", time: "15:00", status: "Upcoming", cost: 20 }
  ];

  return (
    <div style={styles.dashboard}>
      {/* Navigation */}
      <nav style={styles.navbar}>
        <div style={styles.navBrand}>
          <h1 style={styles.logo}>GameZone</h1>
        </div>
        <div style={styles.navLinks}>
          <Link to="/customer/browse-games" style={styles.navLink}>Browse Games</Link>
          <Link to="/customer/booking" style={styles.navLink}>Book Game</Link>
          <Link to="/customer/my-bookings" style={styles.navLink}>My Bookings</Link>
          <Link to="/customer/profile" style={styles.navLink}>Profile</Link>
        </div>
      </nav>

      {/* Dashboard Header */}
      <section style={styles.heroSection}>
        <div style={styles.heroContent}>
          <h1 style={styles.heroTitle}>Welcome to GameZone!</h1>
          <p style={styles.heroDescription}>
            Get ready for an amazing gaming experience! Explore our state-of-the-art gaming machines, 
            book your favorite games, and immerse yourself in the ultimate gaming adventure.
          </p>
          <div style={styles.ctaButtons}>
            <Link to="/customer/browse-games" style={styles.primaryButton}>
              Browse Games
            </Link>
            <Link to="/customer/booking" style={styles.secondaryButton}>
              Book Now
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section style={styles.statsSection}>
        <div style={styles.statsContainer}>
          {stats.map((stat, index) => (
            <div key={index} style={styles.statItem}>
              <h3 style={{ color: stat.color, margin: 0, fontSize: '2.5rem' }}>{stat.value}</h3>
              <p style={{ margin: 0, color: '#cccccc' }}>{stat.title}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Quick Actions */}
      <section style={styles.featuresSection}>
        <h2 style={styles.sectionTitle}>Quick Actions</h2>
        <div style={styles.featuresGrid}>
          {quickActions.map((action, index) => (
            <Link
              key={index}
              to={action.link}
              style={{...styles.featureCard, borderColor: action.color, textDecoration: 'none'}}
            >
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>
                {action.icon}
              </div>
              <h3 style={{ color: action.color, marginBottom: '0.5rem' }}>{action.title}</h3>
              <p style={{ color: '#cccccc', margin: 0 }}>{action.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <section style={styles.activitySection}>
        <h2 style={styles.sectionTitle}>Recent Activity</h2>
        <div style={styles.activityContainer}>
          {recentActivity.map((activity, index) => (
            <div key={index} style={styles.activityCard}>
              <h4 style={{ color: '#00ffff', margin: '0 0 0.5rem 0' }}>{activity.game}</h4>
              <p style={{ color: '#cccccc', margin: 0 }}>
                {activity.date} at {activity.time} • ${activity.cost} • {activity.status}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <h3 style={styles.footerTitle}>GameZone</h3>
            <p style={styles.footerText}>Your ultimate gaming destination with state-of-the-art machines and immersive experiences.</p>
          </div>
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Quick Links</h4>
            <Link to="/customer/browse-games" style={styles.footerLink}>Browse Games</Link>
            <Link to="/customer/booking" style={styles.footerLink}>Book Game</Link>
            <Link to="/customer/my-bookings" style={styles.footerLink}>My Bookings</Link>
            <Link to="/customer/profile" style={styles.footerLink}>Profile</Link>
          </div>
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Contact Info</h4>
            <p style={styles.footerText}>📍 123 Gaming Street, City</p>
            <p style={styles.footerText}>📞 +1 234 567 8900</p>
            <p style={styles.footerText}>✉️ support@gamezone.com</p>
          </div>
        </div>
        <div style={styles.footerBottom}>
          <p style={styles.footerText}>&copy; 2024 GameZone. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

// Styles - Fixed without pseudo-classes
const styles = {
  dashboard: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)',
    color: '#ffffff',
    fontFamily: 'Arial, sans-serif'
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    background: 'rgba(0, 0, 0, 0.8)',
    borderBottom: '1px solid #00ffff'
  },
  navBrand: {
    flex: 1
  },
  logo: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    margin: 0
  },
  navLinks: {
    display: 'flex',
    gap: '1.5rem'
  },
  navLink: {
    color: '#ffffff',
    textDecoration: 'none',
    padding: '0.5rem 1rem',
    borderRadius: '5px',
    transition: 'all 0.3s ease'
  },
  heroSection: {
    padding: '3rem 2rem',
    textAlign: 'center'
  },
  heroTitle: {
    fontSize: '3rem',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '1rem'
  },
  heroDescription: {
    fontSize: '1.2rem',
    color: '#cccccc',
    maxWidth: '600px',
    margin: '0 auto 2rem'
  },
  ctaButtons: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center'
  },
  primaryButton: {
    background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
    color: '#000000',
    border: 'none',
    padding: '1rem 2rem',
    borderRadius: '25px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    transition: 'all 0.3s ease'
  },
  secondaryButton: {
    background: 'transparent',
    color: '#00ffff',
    border: '2px solid #00ffff',
    padding: '1rem 2rem',
    borderRadius: '25px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    textDecoration: 'none',
    display: 'inline-block',
    transition: 'all 0.3s ease'
  },
  statsSection: {
    padding: '2rem',
    background: 'rgba(0, 0, 0, 0.3)'
  },
  statsContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '2rem',
    maxWidth: '1000px',
    margin: '0 auto'
  },
  statItem: {
    textAlign: 'center',
    padding: '1.5rem',
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '10px',
    border: '1px solid rgba(0, 255, 255, 0.2)',
    transition: 'all 0.3s ease'
  },
  featuresSection: {
    padding: '3rem 2rem'
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: '2rem',
    color: '#00ffff',
    marginBottom: '2rem'
  },
  featuresGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1.5rem',
    maxWidth: '1000px',
    margin: '0 auto'
  },
  featureCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '2rem',
    borderRadius: '10px',
    textAlign: 'center',
    border: '1px solid',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none'
  },
  activitySection: {
    padding: '3rem 2rem',
    background: 'rgba(0, 0, 0, 0.5)'
  },
  activityContainer: {
    maxWidth: '800px',
    margin: '0 auto'
  },
  activityCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    padding: '1.5rem',
    borderRadius: '10px',
    marginBottom: '1rem',
    border: '1px solid rgba(0, 255, 255, 0.2)',
    transition: 'all 0.3s ease'
  },
  footer: {
    background: 'rgba(0, 0, 0, 0.8)',
    padding: '2rem',
    borderTop: '1px solid #00ffff'
  },
  footerContent: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem',
    maxWidth: '1000px',
    margin: '0 auto'
  },
  footerSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.5rem'
  },
  footerTitle: {
    color: '#00ffff',
    marginBottom: '1rem'
  },
  footerText: {
    color: '#cccccc',
    margin: 0
  },
  footerLink: {
    color: '#cccccc',
    textDecoration: 'none',
    transition: 'color 0.3s ease'
  },
  footerBottom: {
    textAlign: 'center',
    marginTop: '2rem',
    paddingTop: '1rem',
    borderTop: '1px solid rgba(255, 255, 255, 0.1)'
  }
};

export default CustomerDashboard;
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const MyBookings = () => {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [upcomingBookings, setUpcomingBookings] = useState([]);
  const [pastBookings, setPastBookings] = useState([]);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState('');

  // ✅ Get current user from localStorage
  const getCurrentUser = () => {
    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        console.log("🔍 User from localStorage:", user);
        return user;
      }
      console.log("❌ No user found in localStorage");
      return null;
    } catch (error) {
      console.error("❌ Error getting user data:", error);
      return null;
    }
  };

  // ✅ Fetch user's bookings from backend
  const fetchUserBookings = async () => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      console.error("❌ No user found in localStorage");
      setError("Please login to view your bookings");
      setLoading(false);
      return;
    }

    setUser(currentUser);
    setLoading(true);
    setError('');

    try {
      console.log("📡 Fetching user bookings for user ID:", currentUser._id);
      
      const response = await fetch(`http://localhost:5000/api/bookings/user/${currentUser._id}`);
      console.log("📨 API Response status:", response.status);
      
      const data = await response.json();
      console.log("📊 API Response data:", data);

      if (response.ok) {
        console.log("✅ Bookings fetched successfully. Count:", data.bookings ? data.bookings.length : 0);
        
        // Check if bookings array exists
        if (!data.bookings || !Array.isArray(data.bookings)) {
          console.error("❌ Invalid bookings data:", data);
          setError("Invalid data received from server");
          return;
        }

        const now = new Date();
        const upcoming = [];
        const past = [];
        const payments = [];

        data.bookings.forEach(booking => {
          console.log("📋 Processing booking:", {
            id: booking._id,
            userId: booking.userId,
            gameName: booking.gameName,
            bookingDate: booking.bookingDate,
            status: booking.status
          });

          const bookingDate = new Date(booking.bookingDate);
          
          // Create payment history entry
          payments.push({
            id: booking._id,
            bookingId: booking.bookingId || booking._id,
            date: booking.createdAt ? new Date(booking.createdAt).toISOString().split('T')[0] : 'N/A',
            amount: booking.totalCost || 0,
            game: booking.gameName || 'Unknown Game',
            paymentMethod: booking.paymentMethod || 'Unknown',
            status: booking.paymentStatus || 'Unknown',
            transactionId: booking.transactionId || `TXN-${booking._id ? booking._id.slice(-6).toUpperCase() : 'UNKNOWN'}`
          });

          // Separate upcoming and past bookings
          if (bookingDate >= now && booking.status !== 'Cancelled' && booking.status !== 'Completed') {
            upcoming.push({
              id: booking._id,
              _id: booking._id,
              game: booking.gameName || 'Unknown Game',
              date: new Date(booking.bookingDate).toISOString().split('T')[0],
              time: booking.startTime || 'N/A',
              duration: `${booking.duration || 1} hour${(booking.duration || 1) > 1 ? 's' : ''}`,
              cost: booking.totalCost || 0,
              status: booking.status || 'Unknown',
              machineId: booking.machineId || 'N/A',
              bookingDate: booking.createdAt ? new Date(booking.createdAt).toISOString().split('T')[0] : 'N/A',
              paymentMethod: booking.paymentMethod || 'Unknown',
              paymentStatus: booking.paymentStatus || 'Unknown'
            });
          } else {
            past.push({
              id: booking._id,
              _id: booking._id,
              game: booking.gameName || 'Unknown Game',
              date: new Date(booking.bookingDate).toISOString().split('T')[0],
              time: booking.startTime || 'N/A',
              duration: `${booking.duration || 1} hour${(booking.duration || 1) > 1 ? 's' : ''}`,
              cost: booking.totalCost || 0,
              status: booking.status || 'Unknown',
              machineId: booking.machineId || 'N/A',
              bookingDate: booking.createdAt ? new Date(booking.createdAt).toISOString().split('T')[0] : 'N/A',
              paymentMethod: booking.paymentMethod || 'Unknown',
              paymentStatus: booking.paymentStatus || 'Unknown',
              rating: booking.rating || null
            });
          }
        });

        console.log("📈 Upcoming bookings:", upcoming.length);
        console.log("📊 Past bookings:", past.length);
        console.log("💳 Payment history:", payments.length);

        setUpcomingBookings(upcoming);
        setPastBookings(past);
        setPaymentHistory(payments);
      } else {
        console.error("❌ Error fetching bookings:", data.message);
        setError(data.message || 'Failed to fetch bookings');
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      setError('Network error. Please check if backend is running on port 5000.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load data on component mount
  useEffect(() => {
    fetchUserBookings();
  }, []);

  // ✅ Test API connectivity
  const testAPI = async () => {
    try {
      console.log("🧪 Testing API connectivity...");
      const response = await fetch('http://localhost:5000/api/health');
      const data = await response.json();
      console.log("🏥 API Health:", data);
      
      // Test debug endpoints
      const usersResponse = await fetch('http://localhost:5000/api/debug/users');
      const usersData = await usersResponse.json();
      console.log("👥 Users debug:", usersData);
      
      const bookingsResponse = await fetch('http://localhost:5000/api/debug/bookings');
      const bookingsData = await bookingsResponse.json();
      console.log("📅 Bookings debug:", bookingsData);
      
    } catch (error) {
      console.error("❌ API test failed:", error);
    }
  };

  // ✅ Cancel booking function
  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            status: 'Cancelled',
            paymentStatus: 'Refunded'
          })
        });

        const data = await response.json();

        if (response.ok) {
          alert('Booking cancelled successfully!');
          // Refresh the bookings
          fetchUserBookings();
        } else {
          alert(data.message || 'Failed to cancel booking');
        }
      } catch (error) {
        console.error("Error cancelling booking:", error);
        alert('Network error. Please try again.');
      }
    }
  };

  // ✅ Reschedule booking function
  const handleReschedule = (bookingId) => {
    alert(`Reschedule functionality for booking #${bookingId} would open a reschedule form`);
  };

  // ✅ Rate experience function
  const handleRateExperience = (bookingId) => {
    const rating = prompt('Please rate your experience (1-5 stars):');
    if (rating && rating >= 1 && rating <= 5) {
      alert(`Thank you for your ${rating} star rating!`);
    }
  };

  // ✅ Download receipt function
  const handleDownloadReceipt = (payment) => {
    const receiptContent = `
      GameZone Receipt
      ================
      
      Transaction ID: ${payment.transactionId}
      Booking ID: ${payment.bookingId}
      Date: ${payment.date}
      Game: ${payment.game}
      Amount: $${payment.amount}
      Payment Method: ${payment.paymentMethod}
      Status: ${payment.status}
      
      Thank you for your booking!
    `;
    
    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `receipt-${payment.transactionId}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Confirmed': return '#00ff00';
      case 'Pending': return '#ffff00';
      case 'Completed': return '#00ffff';
      case 'Cancelled': return '#ff4444';
      default: return '#cccccc';
    }
  };

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'Paid': return '#00ff00';
      case 'Refunded': return '#00ffff';
      case 'Pending': return '#ffff00';
      case 'Failed': return '#ff4444';
      default: return '#cccccc';
    }
  };

  // ✅ Render loading state
  if (loading) {
    return (
      <div style={styles.page}>
        <nav style={styles.navbar}>
          <div style={styles.navBrand}>
            <Link to="/customer/dashboard" style={styles.logoLink}>
              <h1 style={styles.logo}>GameZone</h1>
            </Link>
          </div>
          <div style={styles.navLinks}>
            <Link to="/customer/dashboard" style={styles.navLink}>Dashboard</Link>
            <Link to="/customer/browse-games" style={styles.navLink}>Browse Games</Link>
            <Link to="/customer/booking" style={styles.navLink}>Book Game</Link>
            <Link to="/customer/profile" style={styles.navLink}>Profile</Link>
          </div>
        </nav>
        <div style={styles.container}>
          <div style={styles.loadingContainer}>
            <div style={styles.loadingSpinner}></div>
            <p>Loading your bookings...</p>
            <button onClick={testAPI} style={styles.debugButton}>
              Test API Connection
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Render error state
  if (error) {
    return (
      <div style={styles.page}>
        <nav style={styles.navbar}>
          <div style={styles.navBrand}>
            <Link to="/customer/dashboard" style={styles.logoLink}>
              <h1 style={styles.logo}>GameZone</h1>
            </Link>
          </div>
          <div style={styles.navLinks}>
            <Link to="/customer/dashboard" style={styles.navLink}>Dashboard</Link>
            <Link to="/customer/browse-games" style={styles.navLink}>Browse Games</Link>
            <Link to="/customer/booking" style={styles.navLink}>Book Game</Link>
            <Link to="/customer/profile" style={styles.navLink}>Profile</Link>
          </div>
        </nav>
        <div style={styles.container}>
          <div style={styles.errorContainer}>
            <div style={styles.errorIcon}>⚠️</div>
            <h3>Error Loading Bookings</h3>
            <p>{error}</p>
            <div style={styles.errorActions}>
              <button onClick={fetchUserBookings} style={styles.primaryButton}>
                Try Again
              </button>
              <button onClick={testAPI} style={styles.debugButton}>
                Test API Connection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderUpcomingBookings = () => (
    <div>
      <h2 style={styles.sectionTitle}>Upcoming Bookings</h2>
      {upcomingBookings.length > 0 ? (
        <div style={styles.bookingsGrid}>
          {upcomingBookings.map(booking => (
            <div key={booking.id} style={styles.bookingCard}>
              <div style={styles.bookingHeader}>
                <div>
                  <h3 style={styles.gameName}>{booking.game}</h3>
                  <p style={styles.machineId}>Machine: {booking.machineId}</p>
                </div>
                <span style={{...styles.status, color: getStatusColor(booking.status)}}>
                  {booking.status}
                </span>
              </div>
              
              <div style={styles.bookingDetails}>
                <div style={styles.detailRow}>
                  <span>Date & Time:</span>
                  <span>{booking.date} at {booking.time}</span>
                </div>
                <div style={styles.detailRow}>
                  <span>Duration:</span>
                  <span>{booking.duration}</span>
                </div>
                <div style={styles.detailRow}>
                  <span>Cost:</span>
                  <span style={styles.cost}>${booking.cost}</span>
                </div>
                <div style={styles.detailRow}>
                  <span>Payment:</span>
                  <span>{booking.paymentMethod} ({booking.paymentStatus})</span>
                </div>
                <div style={styles.detailRow}>
                  <span>Booked on:</span>
                  <span>{booking.bookingDate}</span>
                </div>
              </div>

              {booking.status === 'Confirmed' && (
                <div style={styles.bookingActions}>
                  <button 
                    style={styles.rescheduleButton}
                    onClick={() => handleReschedule(booking.id)}
                  >
                    Reschedule
                  </button>
                  <button 
                    style={styles.cancelButton}
                    onClick={() => handleCancelBooking(booking._id)}
                  >
                    Cancel Booking
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📅</div>
          <h3>No Upcoming Bookings</h3>
          <p>You don't have any upcoming gaming sessions.</p>
          <Link to="/customer/booking" style={styles.primaryButton}>
            Book Now
          </Link>
        </div>
      )}
    </div>
  );

  const renderPastBookings = () => (
    <div>
      <h2 style={styles.sectionTitle}>Past Bookings</h2>
      {pastBookings.length > 0 ? (
        <div style={styles.bookingsGrid}>
          {pastBookings.map(booking => (
            <div key={booking.id} style={styles.bookingCard}>
              <div style={styles.bookingHeader}>
                <div>
                  <h3 style={styles.gameName}>{booking.game}</h3>
                  <p style={styles.machineId}>Machine: {booking.machineId}</p>
                </div>
                <span style={{...styles.status, color: getStatusColor(booking.status)}}>
                  {booking.status}
                </span>
              </div>
              
              <div style={styles.bookingDetails}>
                <div style={styles.detailRow}>
                  <span>Date & Time:</span>
                  <span>{booking.date} at {booking.time}</span>
                </div>
                <div style={styles.detailRow}>
                  <span>Duration:</span>
                  <span>{booking.duration}</span>
                </div>
                <div style={styles.detailRow}>
                  <span>Cost:</span>
                  <span style={styles.cost}>${booking.cost}</span>
                </div>
                <div style={styles.detailRow}>
                  <span>Payment:</span>
                  <span>{booking.paymentMethod} ({booking.paymentStatus})</span>
                </div>
                <div style={styles.detailRow}>
                  <span>Booked on:</span>
                  <span>{booking.bookingDate}</span>
                </div>
                {booking.rating && (
                  <div style={styles.detailRow}>
                    <span>Your Rating:</span>
                    <span style={styles.rating}>
                      {'⭐'.repeat(booking.rating)}
                    </span>
                  </div>
                )}
              </div>

              {booking.status === 'Completed' && !booking.rating && (
                <div style={styles.bookingActions}>
                  <button 
                    style={styles.secondaryButton}
                    onClick={() => handleRateExperience(booking._id)}
                  >
                    Rate Experience
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>📊</div>
          <h3>No Past Bookings</h3>
          <p>Your past bookings will appear here.</p>
        </div>
      )}
    </div>
  );

  const renderPaymentHistory = () => (
    <div>
      <h2 style={styles.sectionTitle}>Payment History</h2>
      {paymentHistory.length > 0 ? (
        <div style={styles.paymentGrid}>
          {paymentHistory.map(payment => (
            <div key={payment.id} style={styles.paymentCard}>
              <div style={styles.paymentHeader}>
                <div>
                  <h3 style={styles.gameName}>{payment.game}</h3>
                  <p style={styles.transactionId}>Transaction: {payment.transactionId}</p>
                </div>
                <span style={{...styles.status, color: getPaymentStatusColor(payment.status)}}>
                  {payment.status}
                </span>
              </div>
              
              <div style={styles.paymentDetails}>
                <div style={styles.detailRow}>
                  <span>Date:</span>
                  <span>{payment.date}</span>
                </div>
                <div style={styles.detailRow}>
                  <span>Amount:</span>
                  <span style={styles.amount}>{payment.amount} Rupees</span>
                </div>
                <div style={styles.detailRow}>
                  <span>Payment Method:</span>
                  <span>{payment.paymentMethod}</span>
                </div>
                <div style={styles.detailRow}>
                  <span>Booking ID:</span>
                  <span>#{payment.bookingId}</span>
                </div>
              </div>

              <div style={styles.paymentActions}>
                <button 
                  style={styles.secondaryButton}
                  onClick={() => handleDownloadReceipt(payment)}
                >
                  Download Receipt
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={styles.emptyState}>
          <div style={styles.emptyIcon}>💳</div>
          <h3>No Payment History</h3>
          <p>Your payment history will appear here after your first booking.</p>
        </div>
      )}
    </div>
  );

  return (
    <div style={styles.page}>
      {/* Navigation */}
      <nav style={styles.navbar}>
        <div style={styles.navBrand}>
          <Link to="/customer/dashboard" style={styles.logoLink}>
            <h1 style={styles.logo}>GameZone</h1>
          </Link>
        </div>
        <div style={styles.navLinks}>
          <Link to="/customer/dashboard" style={styles.navLink}>Dashboard</Link>
          <Link to="/customer/browse-games" style={styles.navLink}>Browse Games</Link>
          <Link to="/customer/booking" style={styles.navLink}>Book Game</Link>
          <Link to="/customer/profile" style={styles.navLink}>Profile</Link>
        </div>
      </nav>

      {/* Main Content */}
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>My Bookings & History</h1>
          <p style={styles.subtitle}>Manage your gaming sessions and view your booking history</p>
          {user && (
            <p style={styles.userInfo}>User ID: {user._id}</p>
          )}
        </div>

        {/* Debug Section */}
        <div style={styles.debugSection}>
          <button onClick={testAPI} style={styles.debugButton}>
            Test API Connection
          </button>
          <button onClick={fetchUserBookings} style={styles.debugButton}>
            Refresh Bookings
          </button>
        </div>

        {/* Tabs */}
        <div style={styles.tabs}>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'upcoming' && styles.activeTab)
            }}
            onClick={() => setActiveTab('upcoming')}
          >
            📅 Upcoming ({upcomingBookings.length})
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'past' && styles.activeTab)
            }}
            onClick={() => setActiveTab('past')}
          >
            📊 Past ({pastBookings.length})
          </button>
          <button
            style={{
              ...styles.tab,
              ...(activeTab === 'payments' && styles.activeTab)
            }}
            onClick={() => setActiveTab('payments')}
          >
            💳 Payments ({paymentHistory.length})
          </button>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {activeTab === 'upcoming' && renderUpcomingBookings()}
          {activeTab === 'past' && renderPastBookings()}
          {activeTab === 'payments' && renderPaymentHistory()}
        </div>
      </div>

      {/* Footer */}
      <footer style={styles.footer}>
        <div style={styles.footerContent}>
          <div style={styles.footerSection}>
            <h3 style={styles.footerTitle}>GameZone</h3>
            <p style={styles.footerText}>Your ultimate gaming destination with state-of-the-art machines and immersive experiences.</p>
          </div>
          <div style={styles.footerSection}>
            <h4 style={styles.footerTitle}>Quick Links</h4>
            <Link to="/customer/dashboard" style={styles.footerLink}>Dashboard</Link>
            <Link to="/customer/browse-games" style={styles.footerLink}>Browse Games</Link>
            <Link to="/customer/booking" style={styles.footerLink}>Book Game</Link>
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

const styles = {
  page: {
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
  logoLink: {
    textDecoration: 'none'
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
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  },
  header: {
    textAlign: 'center',
    marginBottom: '2rem'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '0.5rem'
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#cccccc',
    margin: '0 0 1rem 0'
  },
  userInfo: {
    fontSize: '0.9rem',
    color: '#888',
    fontFamily: 'monospace',
    background: 'rgba(0,0,0,0.3)',
    padding: '0.5rem',
    borderRadius: '4px',
    display: 'inline-block'
  },
  debugSection: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap'
  },
  debugButton: {
    background: 'rgba(255, 255, 255, 0.1)',
    border: '1px solid #ff00ff',
    color: '#ff00ff',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    cursor: 'pointer',
    fontSize: '0.8rem',
    transition: 'all 0.3s ease'
  },
  tabs: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginBottom: '2rem',
    flexWrap: 'wrap'
  },
  tab: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid #333',
    color: '#cccccc',
    padding: '1rem 2rem',
    borderRadius: '25px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '1rem',
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  activeTab: {
    background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
    color: '#000000',
    borderColor: '#00ffff'
  },
  content: {
    minHeight: '400px'
  },
  sectionTitle: {
    fontSize: '2rem',
    color: '#00ffff',
    marginBottom: '2rem',
    textAlign: 'center'
  },
  bookingsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '1.5rem'
  },
  paymentGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '1.5rem'
  },
  bookingCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '15px',
    padding: '1.5rem',
    border: '1px solid rgba(0, 255, 255, 0.1)',
    transition: 'all 0.3s ease'
  },
  paymentCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '15px',
    padding: '1.5rem',
    border: '1px solid rgba(0, 255, 255, 0.1)',
    transition: 'all 0.3s ease'
  },
  bookingHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem'
  },
  paymentHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: '1rem'
  },
  gameName: {
    color: '#ffffff',
    margin: '0 0 0.5rem 0',
    fontSize: '1.3rem'
  },
  machineId: {
    color: '#cccccc',
    margin: 0,
    fontSize: '0.9rem'
  },
  transactionId: {
    color: '#cccccc',
    margin: 0,
    fontSize: '0.9rem'
  },
  status: {
    fontWeight: 'bold',
    fontSize: '0.9rem'
  },
  bookingDetails: {
    color: '#cccccc',
    marginBottom: '1rem'
  },
  paymentDetails: {
    color: '#cccccc',
    marginBottom: '1rem'
  },
  detailRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0.3rem 0',
    borderBottom: '1px solid rgba(255, 255, 255, 0.05)'
  },
  cost: {
    color: '#00ff00',
    fontWeight: 'bold'
  },
  amount: {
    color: '#00ff00',
    fontWeight: 'bold',
    fontSize: '1.1rem'
  },
  rating: {
    color: '#ffff00'
  },
  bookingActions: {
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'flex-end'
  },
  paymentActions: {
    display: 'flex',
    gap: '0.5rem',
    justifyContent: 'flex-end'
  },
  rescheduleButton: {
    background: 'transparent',
    border: '1px solid #00ffff',
    color: '#00ffff',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '0.9rem'
  },
  cancelButton: {
    background: 'transparent',
    border: '1px solid #ff4444',
    color: '#ff4444',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '0.9rem'
  },
  secondaryButton: {
    background: 'transparent',
    border: '1px solid #00ffff',
    color: '#00ffff',
    padding: '0.5rem 1rem',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    fontSize: '0.9rem'
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
  emptyState: {
    textAlign: 'center',
    padding: '4rem 2rem',
    color: '#cccccc'
  },
  emptyIcon: {
    fontSize: '4rem',
    marginBottom: '1rem'
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '50vh',
    color: '#00ffff'
  },
  loadingSpinner: {
    width: '50px',
    height: '50px',
    border: '5px solid rgba(0, 255, 255, 0.3)',
    borderTop: '5px solid #00ffff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: '1rem'
  },
  errorContainer: {
    textAlign: 'center',
    padding: '4rem 2rem',
    color: '#ff4444'
  },
  errorIcon: {
    fontSize: '4rem',
    marginBottom: '1rem'
  },
  errorActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center',
    marginTop: '2rem',
    flexWrap: 'wrap'
  },
  footer: {
    background: 'rgba(0, 0, 0, 0.8)',
    padding: '2rem',
    borderTop: '1px solid #00ffff',
    marginTop: '3rem'
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

// Add the keyframes for spinner animation
const styleSheet = document.styleSheets[0];
styleSheet.insertRule(`
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`, styleSheet.cssRules.length);

export default MyBookings;
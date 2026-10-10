import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const BookingPage = () => {
  const [bookingStep, setBookingStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [selectedGame, setSelectedGame] = useState(null);
  const [games, setGames] = useState([]);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Booking form state
  const [bookingForm, setBookingForm] = useState({
    gameId: '',
    date: '',
    time: '',
    duration: '1',
    paymentMethod: ''
  });

  // ✅ FIXED: Get current user from localStorage
  const getCurrentUser = () => {
    try {
      console.log("🔍 Checking for user data in localStorage...");
      
      // Check localStorage for user data
      const userData = localStorage.getItem('user');
      console.log("📦 Raw user data from localStorage:", userData);
      
      if (userData) {
        const parsedUser = JSON.parse(userData);
        console.log("✅ User found:", parsedUser);
        return parsedUser;
      }
      
      console.log("❌ No user data found in localStorage");
      return null;
      
    } catch (error) {
      console.error("❌ Error parsing user data:", error);
      return null;
    }
  };

  // ✅ Fetch games from backend
  const fetchGames = async () => {
    setLoading(true);
    try {
      console.log("📡 Fetching games from backend...");
      const response = await fetch('http://localhost:5000/api/games');
      const data = await response.json();
      
      if (response.ok) {
        console.log("✅ Games fetched:", data.games.length);
        setGames(data.games.filter(game => game.maintenanceStatus === 'Operational'));
      } else {
        console.error("❌ Error fetching games:", data.message);
        alert('Failed to fetch games');
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      alert('Network error. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load data on component mount
  useEffect(() => {
    console.log("🚀 BookingPage mounted");
    
    // Check if user is logged in
    const currentUser = getCurrentUser();
    
    if (currentUser) {
      console.log("✅ User is logged in:", currentUser);
      setUser(currentUser);
      fetchGames();
    } else {
      console.log("❌ No user found, redirecting to login...");
      // If no user found, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  // ✅ FIXED: Format date properly for backend
  const formatDateForBackend = (dateString) => {
    if (!dateString) return '';
    const parts = dateString.split('-');
    if (parts.length === 3) {
      const [day, month, year] = parts;
      // Return in YYYY-MM-DD format that can be parsed as Date
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    }
    return dateString;
  };

  // ✅ Fetch available time slots
  const fetchAvailableSlots = async (date) => {
    if (!date) return;
    
    setLoading(true);
    try {
      console.log("🕒 Fetching available slots for:", date);
      const response = await fetch(`http://localhost:5000/api/bookings/availability/${date}`);
      const data = await response.json();
      
      if (response.ok) {
        console.log("✅ Available slots:", data.availableSlots);
        setAvailableSlots(data.availableSlots || []);
      } else {
        console.error("❌ Error fetching available slots:", data.message);
        setAvailableSlots([]);
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      setAvailableSlots([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ Handle date change
  const handleDateChange = (value) => {
    setBookingForm(prev => ({
      ...prev,
      date: value,
      time: '' // Reset time when date changes
    }));
    setSelectedDate(value);
    
    // Fetch available slots with formatted date for backend
    const backendDate = formatDateForBackend(value);
    if (backendDate && /^\d{2}-\d{2}-\d{4}$/.test(value)) {
      fetchAvailableSlots(backendDate);
    }
  };

  // ✅ Handle manual date input properly for DD-MM-YYYY format
  const handleDateInput = (e) => {
    const value = e.target.value;
    
    // Allow only numbers and dashes
    if (/^[0-9-]*$/.test(value)) {
      // If user is typing (input length is changing), update the value
      if (value.length <= 10) { // DD-MM-YYYY is 10 chars
        setBookingForm({...bookingForm, date: value, time: ''});
      }
    }
  };

  // ✅ Validate and format date when input loses focus
  const handleDateBlur = (e) => {
    const value = e.target.value;
    
    // If it's a complete date in DD-MM-YYYY format
    if (/^\d{2}-\d{2}-\d{4}$/.test(value)) {
      const [day, month, year] = value.split('-');
      const date = new Date(`${year}-${month}-${day}`);
      if (!isNaN(date.getTime())) {
        // Valid date
        setBookingForm({...bookingForm, date: value, time: ''});
        setSelectedDate(value);
        // Fetch available slots with formatted date for backend
        const backendDate = formatDateForBackend(value);
        fetchAvailableSlots(backendDate);
      }
    } else if (value) {
      // Invalid date format, show error or clear
      alert('Please enter a valid date in DD-MM-YYYY format');
      setBookingForm({...bookingForm, date: '', time: ''});
    }
  };

  const handleBookingSubmit = async (e) => {
    e.preventDefault();
    
    // Validate date format before submission (DD-MM-YYYY)
    if (!/^\d{2}-\d{2}-\d{4}$/.test(bookingForm.date)) {
      alert('Please enter a valid date in DD-MM-YYYY format');
      return;
    }

    // Validate time selection
    if (!bookingForm.time) {
      alert('Please select a time slot');
      return;
    }

    // Find the selected game
    const game = games.find(g => g._id === bookingForm.gameId);
    if (!game) {
      alert('Please select a valid game');
      return;
    }

    setSelectedGame(game);
    setSelectedDate(bookingForm.date);
    setSelectedTime(bookingForm.time);
    setBookingStep(4); // Go to payment step
  };

  // ✅ FIXED: Create booking with userId included
  const handleBookingConfirmation = async () => {
    if (!bookingForm.paymentMethod) {
      alert('Please select a payment method');
      return;
    }

    // User should already be logged in at this point
    if (!user) {
      alert('Please login to continue with booking');
      navigate('/login');
      return;
    }

    setLoading(true);
    
    try {
      const totalCost = selectedGame.cost * parseInt(bookingForm.duration);
      
      // Create booking data with ALL required fields including userId
      const bookingData = {
        // ✅ FIXED: userId field is now included
        userId: user._id || user.id || 'unknown-user-id',
        userName: user.name,
        userEmail: user.email,
        
        // Game info
        gameId: selectedGame._id,
        gameName: selectedGame.name,
        
        // Booking details
        machineId: `MACH${Math.floor(100 + Math.random() * 900)}`,
        bookingDate: formatDateForBackend(bookingForm.date),
        startTime: bookingForm.time,
        duration: parseInt(bookingForm.duration),
        
        // Payment info
        totalCost: totalCost,
        paymentMethod: bookingForm.paymentMethod,
        
        // Status fields
        status: 'Confirmed',
        paymentStatus: bookingForm.paymentMethod === 'online' ? 'Paid' : 'Pending',
        
        // Additional fields
        notes: `Booking for ${selectedGame.name} by ${user.name}`
      };

      console.log("📤 Creating booking with user data:", bookingData);
      const response = await fetch('http://localhost:5000/api/bookings', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookingData)
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log("✅ Booking created successfully");
        alert('Booking confirmed successfully!');
        setBookingStep(5);
      } else {
        console.error("❌ Booking creation failed:", data.message);
        alert(data.message || 'Failed to create booking');
      }
    } catch (error) {
      console.error("❌ Error creating booking:", error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePaymentMethodSelect = (method) => {
    setBookingForm({...bookingForm, paymentMethod: method});
  };

  const calculateTotal = () => {
    return selectedGame ? selectedGame.cost * parseInt(bookingForm.duration) : 0;
  };

  // If no user found, show loading (will redirect in useEffect)
  if (!user) {
    return (
      <div style={styles.bookingPage}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  // Render the booking form
  const renderBookGameForm = () => (
    <div>
      <h2 style={styles.stepTitle}>Book Your Gaming Session</h2>
      <p style={styles.userWelcome}>Welcome, {user.name}!</p>
      
      <form onSubmit={handleBookingSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Select Game</label>
          <select
            value={bookingForm.gameId}
            onChange={(e) => setBookingForm({...bookingForm, gameId: e.target.value})}
            style={styles.select}
            required
            disabled={loading}
          >
            <option value="">Choose a game...</option>
            {games.map(game => (
              <option key={game._id} value={game._id}>
                {game.name} - {game.cost} Rupees / hour
              </option>
            ))}
          </select>
        </div>

        <div style={styles.grid2Col}>
          <div style={styles.formGroup}>
            <label style={styles.label}>Date</label>
            <input
              type="text"
              placeholder="DD-MM-YYYY"
              value={bookingForm.date}
              onChange={handleDateInput}
              onBlur={handleDateBlur}
              style={styles.dateInput}
              required
            />
            <div style={styles.dateHint}>Format: DD-MM-YYYY</div>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Time</label>
            <select
              value={bookingForm.time}
              onChange={(e) => setBookingForm({...bookingForm, time: e.target.value})}
              style={styles.select}
              required
              disabled={loading || !bookingForm.date || availableSlots.length === 0}
            >
              <option value="">Select time...</option>
              {availableSlots.map(slot => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
              {availableSlots.length === 0 && bookingForm.date && !loading && (
                <option value="" disabled>No available slots for this date</option>
              )}
            </select>
            {loading && <div style={styles.loadingText}>Checking availability...</div>}
            {!loading && bookingForm.date && availableSlots.length === 0 && (
              <div style={styles.noSlotsText}>No available time slots for selected date</div>
            )}
          </div>
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Duration (hours)</label>
          <select
            value={bookingForm.duration}
            onChange={(e) => setBookingForm({...bookingForm, duration: e.target.value})}
            style={styles.select}
            disabled={loading}
          >
            <option value="1">1 hour</option>
            <option value="2">2 hours</option>
            <option value="3">3 hours</option>
          </select>
        </div>

        <button type="submit" style={styles.primaryButton} disabled={loading || !bookingForm.time}>
          {loading ? 'Loading...' : 'Continue to Payment'}
        </button>
      </form>
    </div>
  );

  // Step 4: Payment Selection
  const renderPaymentSelection = () => (
    <div>
      <h2 style={styles.stepTitle}>Select Payment Method</h2>
      
      <div style={styles.bookingSummary}>
        <h3 style={styles.summaryTitle}>Booking Summary</h3>
        <div style={styles.summaryDetails}>
          <div style={styles.summaryRow}>
            <span>Game:</span>
            <span>{selectedGame.name}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Date:</span>
            <span>{selectedDate}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Time:</span>
            <span>{selectedTime}</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Duration:</span>
            <span>{bookingForm.duration} hour(s)</span>
          </div>
          <div style={styles.summaryRow}>
            <span>Price per hour:</span>
            <span>{selectedGame.cost} Rupees</span>
          </div>
          <div style={{...styles.summaryRow, ...styles.totalRow}}>
            <span>Total:</span>
            <span style={styles.totalAmount}>{calculateTotal()} Rupees</span>
          </div>
        </div>
      </div>

      <div style={styles.paymentMethods}>
        <div
          style={{
            ...styles.paymentMethod,
            borderColor: bookingForm.paymentMethod === 'online' ? '#00ffff' : '#333'
          }}
          onClick={() => handlePaymentMethodSelect('online')}
        >
          <div style={styles.paymentIcon}>💳</div>
          <div style={styles.paymentContent}>
            <h3 style={styles.paymentTitle}>Online Payment</h3>
            <p style={styles.paymentDescription}>Pay now securely with your card</p>
          </div>
        </div>
        
        <div
          style={{
            ...styles.paymentMethod,
            borderColor: bookingForm.paymentMethod === 'counter' ? '#00ffff' : '#333'
          }}
          onClick={() => handlePaymentMethodSelect('counter')}
        >
          <div style={styles.paymentIcon}>🏦</div>
          <div style={styles.paymentContent}>
            <h3 style={styles.paymentTitle}>At Counter</h3>
            <p style={styles.paymentDescription}>Pay when you arrive at the venue</p>
          </div>
        </div>
      </div>

      <div style={styles.actionButtons}>
        <button
          style={styles.backButton}
          onClick={() => setBookingStep(1)}
          disabled={loading}
        >
          ← Back to Booking
        </button>
        <button
          style={styles.confirmButton}
          onClick={handleBookingConfirmation}
          disabled={!bookingForm.paymentMethod || loading}
        >
          {loading ? 'Processing...' : 'Confirm Booking'}
        </button>
      </div>
    </div>
  );

  // Step 5: Confirmation
  const renderConfirmation = () => (
    <div style={styles.confirmationContainer}>
      <div style={styles.confirmationIcon}>✅</div>
      <h2 style={styles.confirmationTitle}>Booking Confirmed!</h2>
      <div style={styles.confirmationDetails}>
        <div style={styles.confirmationRow}>
          <span>Game:</span>
          <span>{selectedGame.name}</span>
        </div>
        <div style={styles.confirmationRow}>
          <span>Date:</span>
          <span>{selectedDate}</span>
        </div>
        <div style={styles.confirmationRow}>
          <span>Time:</span>
          <span>{selectedTime}</span>
        </div>
        <div style={styles.confirmationRow}>
          <span>Duration:</span>
          <span>{bookingForm.duration} hour(s)</span>
        </div>
        <div style={styles.confirmationRow}>
          <span>Total:</span>
          <span>{calculateTotal()}Rupees</span>
        </div>
        <div style={styles.confirmationRow}>
          <span>Payment:</span>
          <span>{bookingForm.paymentMethod === 'online' ? 'Paid Online' : 'Pay at Counter'}</span>
        </div>
      </div>
      <div style={styles.confirmationActions}>
        <Link to="/customer/dashboard" style={styles.dashboardButton}>
          Go to Dashboard
        </Link>
        <Link to="/customer/my-bookings" style={styles.bookingsButton}>
          View My Bookings
        </Link>
      </div>
    </div>
  );

  return (
    <div style={styles.bookingPage}>
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
          <Link to="/customer/my-bookings" style={styles.navLink}>My Bookings</Link>
          <Link to="/customer/profile" style={styles.navLink}>Profile</Link>
        </div>
      </nav>

      {/* Booking Content */}
      <div style={styles.bookingContainer}>
        <div style={styles.bookingHeader}>
          <h1 style={styles.bookingTitle}>Book Your Gaming Session</h1>
          <p style={styles.bookingSubtitle}>Reserve your slot and get ready for an amazing experience!</p>
        </div>

        {/* Progress Steps */}
        <div style={styles.progressContainer}>
          <div style={styles.progressSteps}>
            {[1, 2, 3, 4].map((step) => (
              <div key={step} style={styles.progressStep}>
                <div
                  style={{
                    ...styles.progressCircle,
                    background: bookingStep >= step ? '#00ffff' : '#333',
                    color: bookingStep >= step ? '#000' : '#fff'
                  }}
                >
                  {step}
                </div>
                <span style={styles.progressLabel}>
                  {step === 1 && 'Booking'}
                  {step === 2 && 'Review'}
                  {step === 3 && 'Payment'}
                  {step === 4 && 'Confirm'}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content Area */}
        <div style={styles.mainContent}>
          {bookingStep === 1 && renderBookGameForm()}
          {bookingStep === 4 && renderPaymentSelection()}
          {bookingStep === 5 && renderConfirmation()}
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

// Your existing styles remain the same...
const styles = {
  bookingPage: {
    minHeight: '100vh',
    backgroundColor: '#0a0a0a',
    color: '#ffffff',
    fontFamily: "'Arial', sans-serif"
  },
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#111111',
    borderBottom: '1px solid #333'
  },
  navBrand: {
    flex: 1
  },
  logoLink: {
    textDecoration: 'none',
    color: '#00ffff'
  },
  logo: {
    margin: 0,
    fontSize: '1.8rem',
    fontWeight: 'bold',
    color: '#00ffff'
  },
  navLinks: {
    display: 'flex',
    gap: '2rem'
  },
  navLink: {
    color: '#ffffff',
    textDecoration: 'none',
    fontSize: '1rem',
    transition: 'color 0.3s ease'
  },
  bookingContainer: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem'
  },
  bookingHeader: {
    textAlign: 'center',
    marginBottom: '3rem'
  },
  bookingTitle: {
    fontSize: '2.5rem',
    marginBottom: '0.5rem',
    background: 'linear-gradient(45deg, #00ffff, #0080ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text'
  },
  bookingSubtitle: {
    fontSize: '1.1rem',
    color: '#cccccc',
    marginBottom: '2rem'
  },
  progressContainer: {
    marginBottom: '3rem'
  },
  progressSteps: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '4rem'
  },
  progressStep: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem'
  },
  progressCircle: {
    width: '50px',
    height: '50px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    transition: 'all 0.3s ease'
  },
  progressLabel: {
    fontSize: '0.9rem',
    color: '#cccccc'
  },
  mainContent: {
    backgroundColor: '#111111',
    borderRadius: '10px',
    padding: '2rem',
    border: '1px solid #333'
  },
  stepTitle: {
    fontSize: '1.8rem',
    marginBottom: '1.5rem',
    color: '#00ffff',
    textAlign: 'center'
  },
  formGroup: {
    marginBottom: '1.5rem'
  },
  label: {
    display: 'block',
    marginBottom: '0.5rem',
    color: '#ffffff',
    fontWeight: 'bold'
  },
  select: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#222222',
    color: '#ffffff',
    border: '1px solid #444',
    borderRadius: '5px',
    fontSize: '1rem'
  },
  dateInput: {
    width: '100%',
    padding: '0.75rem',
    backgroundColor: '#222222',
    color: '#ffffff',
    border: '1px solid #444',
    borderRadius: '5px',
    fontSize: '1rem'
  },
  dateHint: {
    fontSize: '0.8rem',
    color: '#888',
    marginTop: '0.25rem'
  },
  grid2Col: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '1rem'
  },
  primaryButton: {
    width: '100%',
    padding: '1rem',
    backgroundColor: '#00ffff',
    color: '#000000',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  },
  loadingText: {
    color: '#00ffff',
    fontSize: '0.9rem',
    marginTop: '0.5rem'
  },
  noSlotsText: {
    color: '#ff4444',
    fontSize: '0.9rem',
    marginTop: '0.5rem'
  },
  bookingSummary: {
    backgroundColor: '#222222',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    border: '1px solid #333'
  },
  summaryTitle: {
    color: '#00ffff',
    marginBottom: '1rem',
    fontSize: '1.3rem'
  },
  summaryDetails: {
    display: 'flex',
    flexDirection: 'column',
    gap: '0.75rem'
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.5rem 0',
    borderBottom: '1px solid #333'
  },
  totalRow: {
    borderBottom: 'none',
    borderTop: '2px solid #00ffff',
    paddingTop: '1rem',
    fontWeight: 'bold',
    fontSize: '1.1rem'
  },
  totalAmount: {
    color: '#00ffff',
    fontSize: '1.2rem'
  },
  paymentMethods: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem',
    marginBottom: '2rem'
  },
  paymentMethod: {
    display: 'flex',
    alignItems: 'center',
    padding: '1.5rem',
    backgroundColor: '#222222',
    border: '2px solid #333',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  paymentIcon: {
    fontSize: '2rem',
    marginRight: '1rem'
  },
  paymentContent: {
    flex: 1
  },
  paymentTitle: {
    margin: '0 0 0.5rem 0',
    color: '#ffffff'
  },
  paymentDescription: {
    margin: 0,
    color: '#cccccc',
    fontSize: '0.9rem'
  },
  actionButtons: {
    display: 'flex',
    gap: '1rem'
  },
  backButton: {
    flex: 1,
    padding: '1rem',
    backgroundColor: 'transparent',
    color: '#ffffff',
    border: '1px solid #444',
    borderRadius: '5px',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  },
  confirmButton: {
    flex: 2,
    padding: '1rem',
    backgroundColor: '#00ffff',
    color: '#000000',
    border: 'none',
    borderRadius: '5px',
    fontSize: '1.1rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'background-color 0.3s ease'
  },
  confirmationContainer: {
    textAlign: 'center',
    padding: '2rem'
  },
  confirmationIcon: {
    fontSize: '4rem',
    marginBottom: '1rem'
  },
  confirmationTitle: {
    fontSize: '2rem',
    color: '#00ffff',
    marginBottom: '2rem'
  },
  confirmationDetails: {
    backgroundColor: '#222222',
    padding: '1.5rem',
    borderRadius: '8px',
    marginBottom: '2rem',
    textAlign: 'left'
  },
  confirmationRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '0.75rem 0',
    borderBottom: '1px solid #333'
  },
  confirmationActions: {
    display: 'flex',
    gap: '1rem',
    justifyContent: 'center'
  },
  dashboardButton: {
    padding: '1rem 2rem',
    backgroundColor: '#00ffff',
    color: '#000000',
    textDecoration: 'none',
    borderRadius: '5px',
    fontWeight: 'bold',
    transition: 'background-color 0.3s ease'
  },
  bookingsButton: {
    padding: '1rem 2rem',
    backgroundColor: 'transparent',
    color: '#00ffff',
    textDecoration: 'none',
    border: '1px solid #00ffff',
    borderRadius: '5px',
    fontWeight: 'bold',
    transition: 'all 0.3s ease'
  },
  footer: {
    backgroundColor: '#111111',
    borderTop: '1px solid #333',
    marginTop: '4rem'
  },
  footerContent: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '3rem 2rem',
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '2rem'
  },
  footerSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  footerTitle: {
    color: '#00ffff',
    marginBottom: '1rem',
    fontSize: '1.2rem'
  },
  footerText: {
    color: '#cccccc',
    margin: '0.25rem 0'
  },
  footerLink: {
    color: '#cccccc',
    textDecoration: 'none',
    transition: 'color 0.3s ease'
  },
  footerBottom: {
    borderTop: '1px solid #333',
    padding: '1.5rem 2rem',
    textAlign: 'center'
  },
  userWelcome: {
    textAlign: 'center',
    color: '#00ffff',
    marginBottom: '1rem',
    fontSize: '1.1rem'
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

export default BookingPage;
import React, { useState, useEffect } from 'react';
import './ManageBookings.css';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch real bookings from backend
  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      console.log("📡 Fetching bookings from backend...");
      
      const response = await fetch('http://localhost:5000/api/bookings');
      const data = await response.json();

      if (response.ok) {
        console.log("✅ Bookings fetched successfully:", data.bookings);
        
        // Transform backend booking data to frontend format
        const bookingsData = data.bookings.map(booking => ({
          id: booking._id,
          bookingId: booking.bookingId,
          customerName: booking.userName,
          customerEmail: booking.userEmail,
          machineName: booking.machineId || 'Machine',
          gameName: booking.gameName,
          bookingDate: new Date(booking.bookingDate).toISOString().split('T')[0],
          startTime: booking.startTime,
          endTime: calculateEndTime(booking.startTime, booking.duration),
          duration: booking.duration,
          totalCost: booking.totalCost,
          status: booking.status,
          paymentStatus: booking.paymentStatus,
          _id: booking._id, // Keep MongoDB ID for reference
          userId: booking.userId,
          gameId: booking.gameId
        }));

        setBookings(bookingsData);
      } else {
        setError('Failed to fetch bookings');
        console.error("❌ Error fetching bookings:", data.message);
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      setError('Network error. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  const calculateEndTime = (startTime, duration) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHours = hours + duration;
    return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const handleApproveBooking = async (bookingId) => {
    try {
      console.log("✅ Approving booking:", bookingId);
      
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'Confirmed',
          paymentStatus: 'Paid'
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Booking approved successfully");
        // Update local state
        setBookings(prev => prev.map(booking =>
          booking.id === bookingId
            ? { ...booking, status: 'Confirmed', paymentStatus: 'Paid' }
            : booking
        ));
      } else {
        alert(data.message || 'Failed to approve booking');
      }
    } catch (error) {
      console.error("❌ Error approving booking:", error);
      alert('Network error. Please try again.');
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      try {
        console.log("❌ Cancelling booking:", bookingId);
        
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
          console.log("✅ Booking cancelled successfully");
          // Update local state
          setBookings(prev => prev.map(booking =>
            booking.id === bookingId
              ? { ...booking, status: 'Cancelled', paymentStatus: 'Refunded' }
              : booking
          ));
        } else {
          alert(data.message || 'Failed to cancel booking');
        }
      } catch (error) {
        console.error("❌ Error cancelling booking:", error);
        alert('Network error. Please try again.');
      }
    }
  };

  const handleRescheduleBooking = async (bookingId) => {
    const newDate = prompt('Enter new booking date (YYYY-MM-DD):');
    const newTime = prompt('Enter new start time (HH:MM):');
    
    if (newDate && newTime) {
      try {
        console.log("🔄 Rescheduling booking:", bookingId);
        
        const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            bookingDate: newDate,
            startTime: newTime,
            status: 'Rescheduled'
          })
        });

        const data = await response.json();

        if (response.ok) {
          console.log("✅ Booking rescheduled successfully");
          // Update local state
          setBookings(prev => prev.map(booking =>
            booking.id === bookingId
              ? { 
                  ...booking, 
                  bookingDate: newDate, 
                  startTime: newTime,
                  status: 'Rescheduled' 
                }
              : booking
          ));
        } else {
          alert(data.message || 'Failed to reschedule booking');
        }
      } catch (error) {
        console.error("❌ Error rescheduling booking:", error);
        alert('Network error. Please try again.');
      }
    }
  };

  const handleCompleteBooking = async (bookingId) => {
    try {
      console.log("🏁 Completing booking:", bookingId);
      
      const response = await fetch(`http://localhost:5000/api/bookings/${bookingId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          status: 'Completed'
        })
      });

      const data = await response.json();

      if (response.ok) {
        console.log("✅ Booking marked as completed");
        // Update local state
        setBookings(prev => prev.map(booking =>
          booking.id === bookingId
            ? { ...booking, status: 'Completed' }
            : booking
        ));
      } else {
        alert(data.message || 'Failed to complete booking');
      }
    } catch (error) {
      console.error("❌ Error completing booking:", error);
      alert('Network error. Please try again.');
    }
  };

  // Filter bookings based on search and filters
  const filteredBookings = bookings.filter(booking => {
    const matchesSearch = booking.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.bookingId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.machineName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         booking.gameName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || booking.status === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Confirmed': return 'status-confirmed';
      case 'Pending': return 'status-pending';
      case 'Cancelled': return 'status-cancelled';
      case 'Rescheduled': return 'status-rescheduled';
      case 'Completed': return 'status-completed';
      case 'No Show': return 'status-no-show';
      default: return 'status-pending';
    }
  };

  const getPaymentBadgeClass = (status) => {
    switch (status) {
      case 'Paid': return 'payment-paid';
      case 'Pending': return 'payment-pending';
      case 'Refunded': return 'payment-refunded';
      case 'Failed': return 'payment-failed';
      default: return 'payment-pending';
    }
  };

  if (loading) {
    return (
      <div className="manage-bookings">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading bookings...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manage-bookings">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Bookings</h3>
          <p>{error}</p>
          <button onClick={fetchBookings} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-bookings">
      <div className="bookings-header">
        <div className="header-left">
          <h1>Manage Bookings</h1>
          <p>View and manage all customer bookings</p>
        </div>
        <div className="header-right">
          <div className="bookings-summary">
            <div className="summary-item">
              <span className="summary-count">{bookings.length}</span>
              <span className="summary-label">Total</span>
            </div>
            <div className="summary-item">
              <span className="summary-count">
                {bookings.filter(b => b.status === 'Confirmed').length}
              </span>
              <span className="summary-label">Confirmed</span>
            </div>
            <div className="summary-item">
              <span className="summary-count">
                {bookings.filter(b => b.status === 'Pending').length}
              </span>
              <span className="summary-label">Pending</span>
            </div>
            <div className="summary-item">
              <span className="summary-count">
                {bookings.filter(b => b.status === 'Completed').length}
              </span>
              <span className="summary-label">Completed</span>
            </div>
          </div>
          <button onClick={fetchBookings} className="btn-refresh" title="Refresh Bookings">
            <i className="fas fa-sync-alt"></i> Refresh
          </button>
        </div>
      </div>

      {/* Bookings List */}
      <div className="bookings-content">
        <div className="bookings-toolbar">
          <div className="search-filter-section">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search by customer, booking ID, machine, or game..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
                <option value="Rescheduled">Rescheduled</option>
                <option value="No Show">No Show</option>
              </select>
            </div>
          </div>
        </div>

        <div className="bookings-table-container">
          <table className="bookings-table">
            <thead>
              <tr>
                <th>Booking ID</th>
                <th>Customer</th>
                <th>Machine & Game</th>
                <th>Date & Time</th>
                <th>Duration</th>
                <th>Cost</th>
                <th>Status</th>
                <th>Payment</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredBookings.length > 0 ? (
                filteredBookings.map(booking => (
                  <tr key={booking.id}>
                    <td className="booking-id">
                      <strong>{booking.bookingId}</strong>
                    </td>
                    <td className="customer-info">
                      <div className="customer-details">
                        <strong>{booking.customerName}</strong>
                        <div className="customer-email">{booking.customerEmail}</div>
                        <div className="customer-id">User ID: {booking.userId?.slice(-6)}</div>
                      </div>
                    </td>
                    <td className="machine-game">
                      <div className="machine-name">
                        <i className="fas fa-gamepad"></i> {booking.machineName}
                      </div>
                      <div className="game-name">{booking.gameName}</div>
                      <div className="game-id">Game ID: {booking.gameId?.slice(-6)}</div>
                    </td>
                    <td className="booking-time">
                      <div className="booking-date">
                        <i className="fas fa-calendar"></i> {booking.bookingDate}
                      </div>
                      <div className="time-slot">
                        <i className="fas fa-clock"></i> {booking.startTime} - {booking.endTime}
                      </div>
                    </td>
                    <td className="booking-duration">
                      <span className="duration-badge">
                        {booking.duration} hour{booking.duration > 1 ? 's' : ''}
                      </span>
                    </td>
                    <td className="booking-cost">
                      <strong>${booking.totalCost}</strong>
                    </td>
                    <td className="booking-status">
                      <span className={`status-badge ${getStatusBadgeClass(booking.status)}`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="payment-status">
                      <span className={`payment-badge ${getPaymentBadgeClass(booking.paymentStatus)}`}>
                        {booking.paymentStatus}
                      </span>
                    </td>
                    <td className="booking-actions">
                      {booking.status === 'Pending' && (
                        <>
                          <button 
                            className="btn-approve"
                            onClick={() => handleApproveBooking(booking.id)}
                            title="Approve Booking"
                          >
                            <i className="fas fa-check"></i> Approve
                          </button>
                          <button 
                            className="btn-cancel"
                            onClick={() => handleCancelBooking(booking.id)}
                            title="Cancel Booking"
                          >
                            <i className="fas fa-times"></i> Cancel
                          </button>
                        </>
                      )}
                      {booking.status === 'Confirmed' && (
                        <>
                          <button 
                            className="btn-reschedule"
                            onClick={() => handleRescheduleBooking(booking.id)}
                            title="Reschedule Booking"
                          >
                            <i className="fas fa-calendar-alt"></i> Reschedule
                          </button>
                          <button 
                            className="btn-complete"
                            onClick={() => handleCompleteBooking(booking.id)}
                            title="Mark as Completed"
                          >
                            <i className="fas fa-flag-checkered"></i> Complete
                          </button>
                          <button 
                            className="btn-cancel"
                            onClick={() => handleCancelBooking(booking.id)}
                            title="Cancel Booking"
                          >
                            <i className="fas fa-times"></i> Cancel
                          </button>
                        </>
                      )}
                      {booking.status === 'Completed' && (
                        <span className="no-actions">Completed</span>
                      )}
                      {booking.status === 'Cancelled' && (
                        <span className="no-actions">Cancelled</span>
                      )}
                      {booking.status === 'Rescheduled' && (
                        <button 
                          className="btn-complete"
                          onClick={() => handleCompleteBooking(booking.id)}
                          title="Mark as Completed"
                        >
                          <i className="fas fa-flag-checkered"></i> Complete
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="no-bookings">
                    <div className="no-bookings-message">
                      <i className="fas fa-calendar-times"></i>
                      <p>No bookings found</p>
                      {bookings.length === 0 && (
                        <p className="no-bookings-subtext">
                          No bookings have been created yet. Bookings will appear here when customers make reservations.
                        </p>
                      )}
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Debug Info */}
        <div className="debug-info">
          <details>
            <summary>Debug Information ({bookings.length} bookings)</summary>
            <pre>{JSON.stringify(bookings, null, 2)}</pre>
          </details>
        </div>
      </div>
    </div>
  );
};

export default ManageBookings;
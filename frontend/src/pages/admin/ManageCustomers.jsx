import React, { useState, useEffect } from 'react';
import './ManageCustomers.css';

const ManageCustomers = () => {
  const [customers, setCustomers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [showBookingHistory, setShowBookingHistory] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMembership, setFilterMembership] = useState('all');
  const [editingCustomer, setEditingCustomer] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch real customers from backend
  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      console.log("📡 Fetching customers from backend...");
      
      const response = await fetch('http://localhost:5000/api/debug/users');
      const data = await response.json();

      if (response.ok) {
        console.log("✅ Customers fetched successfully:", data.users);
        
        // Transform backend user data to customer format
        const customersData = data.users
          .filter(user => user.role === 'customer') // Only show customers, not admins
          .map((user, index) => ({
            id: user._id,
            customerId: user.customerId || `CUST${String(index + 1).padStart(3, '0')}`,
            name: user.name,
            email: user.email,
            phone: user.phone || 'Not provided',
            membershipType: getRandomMembershipType(),
            membershipStart: getRandomDate(),
            membershipEnd: getFutureDate(),
            totalSpent: Math.random() * 1000,
            totalBookings: Math.floor(Math.random() * 20),
            status: 'Active',
            registrationDate: new Date().toISOString().split('T')[0],
            _id: user._id // Keep MongoDB ID for reference
          }));

        setCustomers(customersData);
      } else {
        setError('Failed to fetch customers');
        console.error("❌ Error fetching customers:", data.message);
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      setError('Network error. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // Helper functions for mock data (you can replace with real data later)
  const getRandomMembershipType = () => {
    const types = ['Basic', 'Premium', 'VIP'];
    return types[Math.floor(Math.random() * types.length)];
  };

  const getRandomDate = () => {
    const start = new Date(2024, 0, 1);
    const end = new Date();
    const randomDate = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
    return randomDate.toISOString().split('T')[0];
  };

  const getFutureDate = () => {
    const future = new Date();
    future.setMonth(future.getMonth() + 6);
    return future.toISOString().split('T')[0];
  };

  // Fetch booking history for a specific customer
  const fetchCustomerBookings = async (customerId) => {
    try {
      console.log("📡 Fetching bookings for customer:", customerId);
      
      const response = await fetch(`http://localhost:5000/api/bookings/user/${customerId}`);
      const data = await response.json();

      if (response.ok) {
        console.log("✅ Bookings fetched:", data.bookings);
        return data.bookings.map(booking => ({
          id: booking._id,
          customerId: booking.userId,
          bookingId: booking.bookingId,
          machineName: booking.machineId || 'Machine',
          gameName: booking.gameName,
          bookingDate: new Date(booking.bookingDate).toISOString().split('T')[0],
          startTime: booking.startTime,
          endTime: calculateEndTime(booking.startTime, booking.duration),
          duration: booking.duration,
          cost: booking.totalCost,
          status: booking.status,
          paymentStatus: booking.paymentStatus
        }));
      }
      return [];
    } catch (error) {
      console.error("❌ Error fetching bookings:", error);
      return [];
    }
  };

  const calculateEndTime = (startTime, duration) => {
    const [hours, minutes] = startTime.split(':').map(Number);
    const endHours = hours + duration;
    return `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
  };

  const [editFormData, setEditFormData] = useState({
    name: '',
    email: '',
    phone: '',
    membershipType: '',
    status: ''
  });

  const membershipTypes = ['Basic', 'Premium', 'VIP', 'None'];
  const statusOptions = ['Active', 'Inactive', 'Suspended'];

  // Filter customers based on search and filters
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         customer.customerId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesMembership = filterMembership === 'all' || 
                             customer.membershipType === filterMembership;
    
    return matchesSearch && matchesMembership;
  });

  const handleViewBookings = async (customer) => {
    setSelectedCustomer(customer);
    
    // Fetch real booking data for this customer
    const customerBookings = await fetchCustomerBookings(customer._id);
    const customerWithBookings = {
      ...customer,
      bookings: customerBookings,
      payments: customerBookings.map(booking => ({
        id: booking.id,
        customerId: booking.customerId,
        paymentId: `PAY${booking.bookingId.slice(3)}`,
        amount: booking.cost,
        paymentDate: booking.bookingDate,
        paymentMethod: 'Credit Card', // You can get this from booking data if available
        status: booking.paymentStatus,
        bookingId: booking.bookingId
      }))
    };
    
    setSelectedCustomer(customerWithBookings);
    setShowBookingHistory(true);
  };

  const handleEditCustomer = (customer) => {
    setEditingCustomer(customer);
    setEditFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      membershipType: customer.membershipType,
      status: customer.status
    });
    setShowEditForm(true);
  };

  const handleUpdateCustomer = (e) => {
    e.preventDefault();
    setCustomers(prev => prev.map(customer =>
      customer.id === editingCustomer.id
        ? { ...customer, ...editFormData }
        : customer
    ));
    setShowEditForm(false);
    setEditingCustomer(null);
  };

  const handleDeleteCustomer = async (customerId) => {
    if (window.confirm('Are you sure you want to delete this customer? This action cannot be undone.')) {
      try {
        // In a real app, you would call your backend API to delete the user
        // await fetch(`http://localhost:5000/api/users/${customerId}`, { method: 'DELETE' });
        
        // For now, just remove from local state
        setCustomers(prev => prev.filter(customer => customer.id !== customerId));
        console.log("🗑️ Customer deleted (frontend only - backend integration needed)");
      } catch (error) {
        console.error("❌ Error deleting customer:", error);
        alert('Error deleting customer');
      }
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const calculateMembershipDuration = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} days`;
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Active': return 'status-active';
      case 'Inactive': return 'status-inactive';
      case 'Suspended': return 'status-suspended';
      default: return 'status-active';
    }
  };

  const getMembershipBadgeClass = (type) => {
    switch (type) {
      case 'Premium': return 'membership-premium';
      case 'VIP': return 'membership-vip';
      case 'Basic': return 'membership-basic';
      default: return 'membership-none';
    }
  };

  if (loading) {
    return (
      <div className="manage-customers">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading customers...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="manage-customers">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Error Loading Customers</h3>
          <p>{error}</p>
          <button onClick={fetchCustomers} className="btn-primary">
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="manage-customers">
      <div className="customers-header">
        <div className="header-left">
          <h1>Manage Customers</h1>
          <p>View and manage customer accounts, memberships, and booking history</p>
        </div>
        <div className="header-right">
          <div className="customers-summary">
            <div className="summary-item">
              <span className="summary-count">{customers.length}</span>
              <span className="summary-label">Total Customers</span>
            </div>
            <div className="summary-item">
              <span className="summary-count">
                {customers.filter(c => c.status === 'Active').length}
              </span>
              <span className="summary-label">Active</span>
            </div>
            <div className="summary-item">
              <span className="summary-count">
                {customers.filter(c => c.membershipType === 'Premium').length}
              </span>
              <span className="summary-label">Premium</span>
            </div>
          </div>
        </div>
      </div>

      {/* Edit Customer Form */}
      {showEditForm && (
        <div className="customer-form-overlay">
          <div className="customer-form">
            <div className="form-header">
              <h2>Edit Customer</h2>
              <button 
                className="close-btn" 
                onClick={() => setShowEditForm(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={handleUpdateCustomer}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={editFormData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={editFormData.phone}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Membership Type</label>
                  <select
                    name="membershipType"
                    value={editFormData.membershipType}
                    onChange={handleInputChange}
                  >
                    {membershipTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={editFormData.status}
                    onChange={handleInputChange}
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => setShowEditForm(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Update Customer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Booking History Modal */}
      {showBookingHistory && selectedCustomer && (
        <div className="booking-history-overlay">
          <div className="booking-history-modal">
            <div className="modal-header">
              <h2>Booking History - {selectedCustomer.name}</h2>
              <button 
                className="close-btn"
                onClick={() => setShowBookingHistory(false)}
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
            <div className="modal-content">
              <div className="customer-summary">
                <div className="summary-card">
                  <h4>Customer Summary</h4>
                  <div className="summary-details">
                    <p><strong>Total Bookings:</strong> {selectedCustomer.bookings?.length || 0}</p>
                    <p><strong>Total Spent:</strong> ${selectedCustomer.totalSpent}</p>
                    <p><strong>Membership:</strong> {selectedCustomer.membershipType}</p>
                    <p><strong>Status:</strong> 
                      <span className={`status-badge ${getStatusBadgeClass(selectedCustomer.status)}`}>
                        {selectedCustomer.status}
                      </span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="bookings-section">
                <h3>Recent Bookings</h3>
                {selectedCustomer.bookings && selectedCustomer.bookings.length > 0 ? (
                  <div className="bookings-list">
                    {selectedCustomer.bookings.map(booking => (
                      <div key={booking.id} className="booking-item">
                        <div className="booking-info">
                          <div className="booking-main">
                            <strong>{booking.gameName}</strong>
                            <span className="booking-machine">{booking.machineName}</span>
                          </div>
                          <div className="booking-details">
                            <span>{booking.bookingDate} | {booking.startTime} - {booking.endTime}</span>
                            <span>Duration: {booking.duration} hours</span>
                          </div>
                        </div>
                        <div className="booking-meta">
                          <div className="booking-cost">${booking.cost}</div>
                          <div className={`booking-status ${booking.status.toLowerCase()}`}>
                            {booking.status}
                          </div>
                          <div className={`payment-status ${booking.paymentStatus.toLowerCase()}`}>
                            {booking.paymentStatus}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-bookings">
                    <i className="fas fa-calendar-times"></i>
                    <p>No booking history found</p>
                  </div>
                )}
              </div>

              <div className="payments-section">
                <h3>Payment History</h3>
                {selectedCustomer.payments && selectedCustomer.payments.length > 0 ? (
                  <div className="payments-list">
                    {selectedCustomer.payments.map(payment => (
                      <div key={payment.id} className="payment-item">
                        <div className="payment-info">
                          <strong>Payment #{payment.paymentId}</strong>
                          <span>Date: {payment.paymentDate}</span>
                          <span>Method: {payment.paymentMethod}</span>
                        </div>
                        <div className="payment-meta">
                          <div className="payment-amount">${payment.amount}</div>
                          <div className={`payment-status ${payment.status.toLowerCase()}`}>
                            {payment.status}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="no-payments">
                    <i className="fas fa-receipt"></i>
                    <p>No payment history found</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Customers List */}
      <div className="customers-content">
        <div className="customers-toolbar">
          <div className="search-filter-section">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search customers by name, email, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="filter-group">
              <select
                value={filterMembership}
                onChange={(e) => setFilterMembership(e.target.value)}
              >
                <option value="all">All Memberships</option>
                <option value="Basic">Basic</option>
                <option value="Premium">Premium</option>
                <option value="VIP">VIP</option>
                <option value="None">None</option>
              </select>
            </div>
            <button onClick={fetchCustomers} className="btn-refresh" title="Refresh Customers">
              <i className="fas fa-sync-alt"></i>
            </button>
          </div>
        </div>

        <div className="customers-table-container">
          <table className="customers-table">
            <thead>
              <tr>
                <th>Customer ID</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Membership</th>
                <th>Duration</th>
                <th>Total Spent</th>
                <th>Bookings</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCustomers.length > 0 ? (
                filteredCustomers.map(customer => (
                  <tr key={customer.id}>
                    <td className="customer-id">{customer.customerId}</td>
                    <td className="customer-name">
                      <div className="name-avatar">
                        <div className="avatar">
                          {customer.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <strong>{customer.name}</strong>
                          <div className="customer-email">{customer.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="customer-contact">
                      <div>{customer.phone}</div>
                      <div className="contact-email">{customer.email}</div>
                    </td>
                    <td className="customer-membership">
                      <span className={`membership-badge ${getMembershipBadgeClass(customer.membershipType)}`}>
                        {customer.membershipType}
                      </span>
                    </td>
                    <td className="membership-duration">
                      {calculateMembershipDuration(customer.membershipStart, customer.membershipEnd)}
                    </td>
                    <td className="total-spent">
                      <strong>${customer.totalSpent.toFixed(2)}</strong>
                    </td>
                    <td className="total-bookings">
                      <span className="bookings-count">{customer.totalBookings}</span>
                    </td>
                    <td className="customer-status">
                      <span className={`status-badge ${getStatusBadgeClass(customer.status)}`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="customer-actions">
                      <button 
                        className="btn-view"
                        onClick={() => handleViewBookings(customer)}
                        title="View Booking History"
                      >
                        <i className="fas fa-history"></i>
                      </button>
                      <button 
                        className="btn-edit"
                        onClick={() => handleEditCustomer(customer)}
                        title="Edit Customer"
                      >
                        <i className="fas fa-edit"></i>
                      </button>
                      <button 
                        className="btn-delete"
                        onClick={() => handleDeleteCustomer(customer.id)}
                        title="Delete Customer"
                      >
                        <i className="fas fa-trash"></i>
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="no-customers">
                    <div className="no-customers-message">
                      <i className="fas fa-users"></i>
                      <p>No customers found</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageCustomers;
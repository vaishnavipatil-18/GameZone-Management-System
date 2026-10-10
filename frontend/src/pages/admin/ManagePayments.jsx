import React, { useState } from 'react';
import './ManagePayments.css';

const ManagePayments = () => {
  const [payments, setPayments] = useState([
    {
      id: 1,
      paymentId: 'P001',
      customerName: 'John Smith',
      bookingId: 'B001',
      amount: 25.50,
      paymentDate: '2024-01-20',
      paymentMethod: 'Credit Card',
      status: 'Completed',
      customerEmail: 'john@email.com'
    },
    {
      id: 2,
      paymentId: 'P002',
      customerName: 'Sarah Johnson',
      bookingId: 'B002',
      amount: 22.00,
      paymentDate: '2024-01-25',
      paymentMethod: 'Debit Card',
      status: 'Completed',
      customerEmail: 'sarah@email.com'
    },
    {
      id: 3,
      paymentId: 'P003',
      customerName: 'Mike Chen',
      bookingId: 'B003',
      amount: 28.75,
      paymentDate: '2024-01-22',
      paymentMethod: 'Cash',
      status: 'Completed',
      customerEmail: 'mike@email.com'
    },
    {
      id: 4,
      paymentId: 'P004',
      customerName: 'Emily Davis',
      bookingId: 'B004',
      amount: 35.00,
      paymentDate: '2024-01-23',
      paymentMethod: 'Credit Card',
      status: 'Refunded',
      customerEmail: 'emily@email.com'
    },
    {
      id: 5,
      paymentId: 'P005',
      customerName: 'Alex Brown',
      bookingId: 'B005',
      amount: 18.50,
      paymentDate: '2024-01-24',
      paymentMethod: 'Online Payment',
      status: 'Pending',
      customerEmail: 'alex@email.com'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterMethod, setFilterMethod] = useState('all');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  // Calculate revenue stats
  const totalRevenue = payments
    .filter(p => p.status === 'Completed')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const pendingAmount = payments
    .filter(p => p.status === 'Pending')
    .reduce((sum, payment) => sum + payment.amount, 0);

  const refundedAmount = payments
    .filter(p => p.status === 'Refunded')
    .reduce((sum, payment) => sum + payment.amount, 0);

  // Filter payments based on search and filters
  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.paymentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         payment.bookingId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || payment.status === filterStatus;
    const matchesMethod = filterMethod === 'all' || payment.paymentMethod === filterMethod;
    
    const matchesDate = (!dateRange.start || payment.paymentDate >= dateRange.start) &&
                       (!dateRange.end || payment.paymentDate <= dateRange.end);
    
    return matchesSearch && matchesStatus && matchesMethod && matchesDate;
  });

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Completed': return 'status-completed';
      case 'Pending': return 'status-pending';
      case 'Refunded': return 'status-refunded';
      case 'Failed': return 'status-failed';
      default: return 'status-pending';
    }
  };

  const getMethodBadgeClass = (method) => {
    switch (method) {
      case 'Credit Card': return 'method-credit';
      case 'Debit Card': return 'method-debit';
      case 'Cash': return 'method-cash';
      case 'Online Payment': return 'method-online';
      default: return 'method-other';
    }
  };

  const handleGenerateReport = () => {
    const reportData = {
      totalPayments: filteredPayments.length,
      totalRevenue: filteredPayments
        .filter(p => p.status === 'Completed')
        .reduce((sum, p) => sum + p.amount, 0),
      dateRange: dateRange,
      generatedAt: new Date().toLocaleString()
    };
    
    alert(`Revenue Report Generated!\n
Total Payments: ${reportData.totalPayments}
Total Revenue: $${reportData.totalRevenue.toFixed(2)}
Date Range: ${dateRange.start || 'Start'} to ${dateRange.end || 'End'}
Generated: ${reportData.generatedAt}`);
  };

  const handleRefund = (paymentId) => {
    if (window.confirm('Are you sure you want to process refund for this payment?')) {
      setPayments(prev => prev.map(payment =>
        payment.id === paymentId
          ? { ...payment, status: 'Refunded' }
          : payment
      ));
    }
  };

  return (
    <div className="manage-payments">
      <div className="payments-header">
        <div className="header-left">
          <h1>Payments & Transactions</h1>
          <p>View and manage all customer payments</p>
        </div>
        <div className="header-right">
          <button 
            className="btn-report"
            onClick={handleGenerateReport}
          >
            <i className="fas fa-chart-bar"></i>
            Generate Report
          </button>
        </div>
      </div>

      {/* Revenue Stats */}
      <div className="revenue-stats">
        <div className="stat-card">
          <div className="stat-icon revenue">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="stat-info">
            <h3>${totalRevenue.toFixed(2)}</h3>
            <p>Total Revenue</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon pending">
            <i className="fas fa-clock"></i>
          </div>
          <div className="stat-info">
            <h3>${pendingAmount.toFixed(2)}</h3>
            <p>Pending Payments</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon refunded">
            <i className="fas fa-undo"></i>
          </div>
          <div className="stat-info">
            <h3>${refundedAmount.toFixed(2)}</h3>
            <p>Refunded Amount</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon total">
            <i className="fas fa-receipt"></i>
          </div>
          <div className="stat-info">
            <h3>{payments.length}</h3>
            <p>Total Transactions</p>
          </div>
        </div>
      </div>

      {/* Payments List */}
      <div className="payments-content">
        <div className="payments-toolbar">
          <div className="search-filter-section">
            <div className="search-box">
              <i className="fas fa-search"></i>
              <input
                type="text"
                placeholder="Search by customer, payment ID, or booking ID..."
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
                <option value="Completed">Completed</option>
                <option value="Pending">Pending</option>
                <option value="Refunded">Refunded</option>
              </select>
            </div>
            <div className="filter-group">
              <select
                value={filterMethod}
                onChange={(e) => setFilterMethod(e.target.value)}
              >
                <option value="all">All Methods</option>
                <option value="Credit Card">Credit Card</option>
                <option value="Debit Card">Debit Card</option>
                <option value="Cash">Cash</option>
                <option value="Online Payment">Online Payment</option>
              </select>
            </div>
            <div className="date-filter">
              <input
                type="date"
                placeholder="Start Date"
                value={dateRange.start}
                onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
              />
              <span>to</span>
              <input
                type="date"
                placeholder="End Date"
                value={dateRange.end}
                onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
              />
            </div>
          </div>
        </div>

        <div className="payments-table-container">
          <table className="payments-table">
            <thead>
              <tr>
                <th>Payment ID</th>
                <th>Customer</th>
                <th>Booking ID</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Method</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredPayments.length > 0 ? (
                filteredPayments.map(payment => (
                  <tr key={payment.id}>
                    <td className="payment-id">{payment.paymentId}</td>
                    <td className="customer-info">
                      <strong>{payment.customerName}</strong>
                      <div className="customer-email">{payment.customerEmail}</div>
                    </td>
                    <td className="booking-id">{payment.bookingId}</td>
                    <td className="payment-amount">
                      <strong>${payment.amount}</strong>
                    </td>
                    <td className="payment-date">
                      {payment.paymentDate}
                    </td>
                    <td className="payment-method">
                      <span className={`method-badge ${getMethodBadgeClass(payment.paymentMethod)}`}>
                        {payment.paymentMethod}
                      </span>
                    </td>
                    <td className="payment-status">
                      <span className={`status-badge ${getStatusBadgeClass(payment.status)}`}>
                        {payment.status}
                      </span>
                    </td>
                    <td className="payment-actions">
                      {payment.status === 'Completed' && (
                        <button 
                          className="btn-refund"
                          onClick={() => handleRefund(payment.id)}
                          title="Process Refund"
                        >
                          <i className="fas fa-undo"></i>
                        </button>
                      )}
                      {payment.status === 'Pending' && (
                        <span className="no-action">-</span>
                      )}
                      {payment.status === 'Refunded' && (
                        <span className="refunded-text">Refunded</span>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="8" className="no-payments">
                    <div className="no-payments-message">
                      <i className="fas fa-receipt"></i>
                      <p>No payments found</p>
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

export default ManagePayments;
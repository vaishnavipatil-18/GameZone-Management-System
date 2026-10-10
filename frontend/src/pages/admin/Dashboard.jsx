import React, { useState } from 'react';
import './AdminDashboard.css';
import ManageGames from './ManageGames';
import ManageMachines from './ManageMachines';
import ManageCustomers from './ManageCustomers';
import ManageEmployees from './ManageEmployees';
import ManageBookings from './ManageBookings';
import ManageMachine from './ManagePayments';
import ManagePayments from './ManagePayments';

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Mock data for dashboard
  const dashboardStats = {
    totalCustomers: 1250,
    totalBookings: 345,
    totalGames: 89,
    totalMachines: 156,
    totalRevenue: 125430,
    activeEmployees: 24
  };

  const recentActivities = [
    { id: 1, type: 'booking', user: 'John Doe', time: '2 mins ago', details: 'Booked 2 hours' },
    { id: 2, type: 'payment', user: 'Sarah Smith', time: '10 mins ago', details: 'Payment received $50' },
    { id: 3, type: 'game', user: 'Admin', time: '1 hour ago', details: 'Added new game "Cyber Race"' },
    { id: 4, type: 'maintenance', user: 'Tech Team', time: '2 hours ago', details: 'Machine #23 maintenance completed' }
  ];

  const renderOverview = () => (
    <div className="overview-section">
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-users"></i>
          </div>
          <div className="stat-info">
            <h3>{dashboardStats.totalCustomers}</h3>
            <p>Total Customers</p>
          </div>
          <div className="stat-trend positive">
            <i className="fas fa-arrow-up"></i>
            <span>12%</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-calendar-check"></i>
          </div>
          <div className="stat-info">
            <h3>{dashboardStats.totalBookings}</h3>
            <p>Today's Bookings</p>
          </div>
          <div className="stat-trend positive">
            <i className="fas fa-arrow-up"></i>
            <span>8%</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-gamepad"></i>
          </div>
          <div className="stat-info">
            <h3>{dashboardStats.totalGames}</h3>
            <p>Available Games</p>
          </div>
          <div className="stat-trend positive">
            <i className="fas fa-arrow-up"></i>
            <span>5%</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-desktop"></i>
          </div>
          <div className="stat-info">
            <h3>{dashboardStats.totalMachines}</h3>
            <p>Gaming Machines</p>
          </div>
          <div className="stat-trend negative">
            <i className="fas fa-arrow-down"></i>
            <span>2%</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <div className="stat-info">
            <h3>${dashboardStats.totalRevenue.toLocaleString()}</h3>
            <p>Total Revenue</p>
          </div>
          <div className="stat-trend positive">
            <i className="fas fa-arrow-up"></i>
            <span>15%</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">
            <i className="fas fa-user-tie"></i>
          </div>
          <div className="stat-info">
            <h3>{dashboardStats.activeEmployees}</h3>
            <p>Active Employees</p>
          </div>
          <div className="stat-trend neutral">
            <i className="fas fa-minus"></i>
            <span>0%</span>
          </div>
        </div>
      </div>

      <div className="charts-section">
        <div className="chart-card">
          <h3>Revenue Overview</h3>
          <div className="chart-placeholder">
            <p>Revenue chart will be displayed here</p>
          </div>
        </div>
        
        <div className="chart-card">
          <h3>Booking Trends</h3>
          <div className="chart-placeholder">
            <p>Booking trends chart will be displayed here</p>
          </div>
        </div>
      </div>

      <div className="recent-activities">
        <h3>Recent Activities</h3>
        <div className="activities-list">
          {recentActivities.map(activity => (
            <div key={activity.id} className="activity-item">
              <div className="activity-icon">
                <i className={`fas fa-${getActivityIcon(activity.type)}`}></i>
              </div>
              <div className="activity-details">
                <p className="activity-user">{activity.user}</p>
                <p className="activity-desc">{activity.details}</p>
              </div>
              <div className="activity-time">{activity.time}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const getActivityIcon = (type) => {
    const icons = {
      booking: 'calendar-check',
      payment: 'credit-card',
      game: 'gamepad',
      maintenance: 'tools'
    };
    return icons[type] || 'bell';
  };

  const renderSection = () => {
    switch (activeSection) {
      case 'overview':
        return renderOverview();
      case 'games':
        return <ManageGames />;
      case 'machines':
        return <ManageMachines />;
      case 'customers':
        return <ManageCustomers />;
      case 'employees':
        return <ManageEmployees />;
      case 'bookings':
        return <ManageBookings/>;
      case 'payments':
        return <ManagePayments />;
      default:
        return renderOverview();
    }
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>GameZone Admin</h2>
          <button 
            className="toggle-sidebar"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <i className={`fas fa-chevron-${sidebarOpen ? 'left' : 'right'}`}></i>
          </button>
        </div>
        
        <nav className="sidebar-nav">
          <div 
            className={`nav-item ${activeSection === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveSection('overview')}
          >
            <i className="fas fa-chart-line"></i>
            <span>Dashboard Overview</span>
          </div>
          
          <div className="nav-section">Management</div>
          
          <div 
            className={`nav-item ${activeSection === 'games' ? 'active' : ''}`}
            onClick={() => setActiveSection('games')}
          >
            <i className="fas fa-gamepad"></i>
            <span>Manage Games</span>
          </div>
          
          <div 
            className={`nav-item ${activeSection === 'machines' ? 'active' : ''}`}
            onClick={() => setActiveSection('machines')}
          >
            <i className="fas fa-desktop"></i>
            <span>Manage Machines</span>
          </div>
          
          <div 
            className={`nav-item ${activeSection === 'customers' ? 'active' : ''}`}
            onClick={() => setActiveSection('customers')}
          >
            <i className="fas fa-users"></i>
            <span>Manage Customers</span>
          </div>
          
          <div 
            className={`nav-item ${activeSection === 'employees' ? 'active' : ''}`}
            onClick={() => setActiveSection('employees')}
          >
            <i className="fas fa-user-tie"></i>
            <span>Manage Employees</span>
          </div>
          
          <div 
            className={`nav-item ${activeSection === 'bookings' ? 'active' : ''}`}
            onClick={() => setActiveSection('bookings')}
          >
            <i className="fas fa-calendar-check"></i>
            <span>Manage Bookings</span>
          </div>
          
          <div className="nav-section">Financial</div>
          
          <div 
            className={`nav-item ${activeSection === 'payments' ? 'active' : ''}`}
            onClick={() => setActiveSection('payments')}
          >
            <i className="fas fa-credit-card"></i>
            <span>Payments & Transactions</span>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <header className="admin-header">
          <div className="header-left">
            <h1>Admin Dashboard</h1>
            <p>Welcome back, Administrator!</p>
          </div>
          <div className="header-right">
            <div className="admin-search">
              <input type="text" placeholder="Search..." />
              <i className="fas fa-search"></i>
            </div>
            <div className="admin-profile">
              <div className="profile-avatar">
                <i className="fas fa-user-shield"></i>
              </div>
              <span>Admin</span>
              <i className="fas fa-chevron-down"></i>
            </div>
          </div>
        </header>

        <div className="content-area">
          {renderSection()}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
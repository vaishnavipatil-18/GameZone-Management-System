import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Profile.css';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('profile');
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Get user data from localStorage
  useEffect(() => {
    const fetchUserData = () => {
      try {
        const userData = localStorage.getItem('user');
        if (userData) {
          const user = JSON.parse(userData);
          setUser(user);
          setFormData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            currentPassword: '',
            newPassword: '',
            confirmPassword: ''
          });
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    
    try {
      // In a real app, you would call your backend API to update the user
      // const response = await fetch(`http://localhost:5000/api/users/${user._id}`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     name: formData.name,
      //     email: formData.email,
      //     phone: formData.phone
      //   })
      // });

      // For now, update localStorage
      const updatedUser = {
        ...user,
        name: formData.name,
        email: formData.email,
        phone: formData.phone
      };
      
      localStorage.setItem('user', JSON.stringify(updatedUser));
      setUser(updatedUser);
      setEditMode(false);
      
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile. Please try again.');
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      alert('New passwords do not match!');
      return;
    }

    if (formData.newPassword.length < 6) {
      alert('Password must be at least 6 characters long!');
      return;
    }

    try {
      // In a real app, you would call your backend API to change password
      // const response = await fetch(`http://localhost:5000/api/users/${user._id}/password`, {
      //   method: 'PUT',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     currentPassword: formData.currentPassword,
      //     newPassword: formData.newPassword
      //   })
      // });

      // For now, just show success message
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));
      
      alert('Password changed successfully!');
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Error changing password. Please try again.');
    }
  };

  const getInitials = (name) => {
    return name ? name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U';
  };

  const getMembershipType = () => {
    // This would come from your backend in a real app
    const types = ['Basic', 'Premium', 'VIP'];
    return types[Math.floor(Math.random() * types.length)];
  };

  const getMemberSince = () => {
    return user ? new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }) : '';
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>No User Found</h3>
          <p>Please login to view your profile.</p>
          <Link to="/login" className="btn-primary">
            Go to Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      {/* Navigation */}
      <nav className="profile-nav">
        <div className="nav-brand">
          <Link to="/customer/dashboard" className="logo-link">
            <h1 className="logo">GameZone</h1>
          </Link>
        </div>
        <div className="nav-links">
          <Link to="/customer/dashboard" className="nav-link">Dashboard</Link>
          <Link to="/customer/browse-games" className="nav-link">Browse Games</Link>
          <Link to="/customer/booking" className="nav-link">Book Game</Link>
          <Link to="/customer/my-bookings" className="nav-link">My Bookings</Link>
          <Link to="/customer/profile" className="nav-link active">Profile</Link>
        </div>
      </nav>

      <div className="profile-container">
        {/* Sidebar */}
        <div className="profile-sidebar">
          <div className="user-card">
            <div className="user-avatar">
              <span className="avatar-initials">{getInitials(user.name)}</span>
            </div>
            <div className="user-info">
              <h2>{user.name}</h2>
              <p className="user-email">{user.email}</p>
              <div className={`membership-badge membership-${getMembershipType().toLowerCase()}`}>
                {getMembershipType()} Member
              </div>
            </div>
          </div>

          <div className="sidebar-stats">
            <div className="stat-item">
              <div className="stat-number">12</div>
              <div className="stat-label">Total Bookings</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">$450</div>
              <div className="stat-label">Total Spent</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">8</div>
              <div className="stat-label">Games Played</div>
            </div>
          </div>

          <nav className="sidebar-nav">
            <button 
              className={`nav-item ${activeTab === 'profile' ? 'active' : ''}`}
              onClick={() => setActiveTab('profile')}
            >
              <i className="fas fa-user"></i>
              Profile Information
            </button>
            <button 
              className={`nav-item ${activeTab === 'security' ? 'active' : ''}`}
              onClick={() => setActiveTab('security')}
            >
              <i className="fas fa-shield-alt"></i>
              Security
            </button>
            <button 
              className={`nav-item ${activeTab === 'preferences' ? 'active' : ''}`}
              onClick={() => setActiveTab('preferences')}
            >
              <i className="fas fa-cog"></i>
              Preferences
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className="profile-content">
          <div className="content-header">
            <h1>My Profile</h1>
            <p>Manage your account settings and preferences</p>
          </div>

          {/* Profile Information Tab */}
          {activeTab === 'profile' && (
            <div className="tab-content">
              <div className="section-card">
                <div className="section-header">
                  <h2>Personal Information</h2>
                  {!editMode && (
                    <button 
                      className="btn-edit"
                      onClick={() => setEditMode(true)}
                    >
                      <i className="fas fa-edit"></i>
                      Edit Profile
                    </button>
                  )}
                </div>

                {!editMode ? (
                  <div className="info-grid">
                    <div className="info-item">
                      <label>Full Name</label>
                      <p>{user.name}</p>
                    </div>
                    <div className="info-item">
                      <label>Email Address</label>
                      <p>{user.email}</p>
                    </div>
                    <div className="info-item">
                      <label>Phone Number</label>
                      <p>{user.phone || 'Not provided'}</p>
                    </div>
                    <div className="info-item">
                      <label>Customer ID</label>
                      <p>{user.customerId || 'N/A'}</p>
                    </div>
                    <div className="info-item">
                      <label>Member Since</label>
                      <p>{getMemberSince()}</p>
                    </div>
                    <div className="info-item">
                      <label>Membership Type</label>
                      <p className={`membership-text membership-${getMembershipType().toLowerCase()}`}>
                        {getMembershipType()}
                      </p>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handleProfileUpdate}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Full Name *</label>
                        <input
                          type="text"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Email Address *</label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="form-group">
                        <label>Phone Number</label>
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                        />
                      </div>
                    </div>
                    <div className="form-actions">
                      <button 
                        type="button" 
                        className="btn-secondary"
                        onClick={() => setEditMode(false)}
                      >
                        Cancel
                      </button>
                      <button type="submit" className="btn-primary">
                        Save Changes
                      </button>
                    </div>
                  </form>
                )}
              </div>

              <div className="section-card">
                <h2>Account Statistics</h2>
                <div className="stats-grid">
                  <div className="stat-card">
                    <div className="stat-icon">
                      <i className="fas fa-calendar-check"></i>
                    </div>
                    <div className="stat-content">
                      <div className="stat-number">12</div>
                      <div className="stat-label">Total Bookings</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <i className="fas fa-dollar-sign"></i>
                    </div>
                    <div className="stat-content">
                      <div className="stat-number">$450</div>
                      <div className="stat-label">Total Spent</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <i className="fas fa-gamepad"></i>
                    </div>
                    <div className="stat-content">
                      <div className="stat-number">8</div>
                      <div className="stat-label">Games Played</div>
                    </div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-icon">
                      <i className="fas fa-star"></i>
                    </div>
                    <div className="stat-content">
                      <div className="stat-number">4.8</div>
                      <div className="stat-label">Avg Rating</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="tab-content">
              <div className="section-card">
                <h2>Change Password</h2>
                <form onSubmit={handlePasswordChange}>
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Current Password *</label>
                      <input
                        type="password"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>New Password *</label>
                      <input
                        type="password"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleInputChange}
                        required
                        minLength="6"
                      />
                    </div>
                    <div className="form-group">
                      <label>Confirm New Password *</label>
                      <input
                        type="password"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        required
                        minLength="6"
                      />
                    </div>
                  </div>
                  <div className="form-actions">
                    <button type="submit" className="btn-primary">
                      Change Password
                    </button>
                  </div>
                </form>
              </div>

              <div className="section-card">
                <h2>Security Settings</h2>
                <div className="security-settings">
                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Two-Factor Authentication</h4>
                      <p>Add an extra layer of security to your account</p>
                    </div>
                    <button className="btn-secondary">
                      Enable
                    </button>
                  </div>
                  <div className="setting-item">
                    <div className="setting-info">
                      <h4>Login Activity</h4>
                      <p>View your recent login history</p>
                    </div>
                    <button className="btn-secondary">
                      View History
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Preferences Tab */}
          {activeTab === 'preferences' && (
            <div className="tab-content">
              <div className="section-card">
                <h2>Notification Preferences</h2>
                <div className="preferences-list">
                  <div className="preference-item">
                    <div className="preference-info">
                      <h4>Booking Confirmations</h4>
                      <p>Get notified when your booking is confirmed</p>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="preference-item">
                    <div className="preference-info">
                      <h4>Promotional Emails</h4>
                      <p>Receive offers and promotions</p>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" defaultChecked />
                      <span className="slider"></span>
                    </label>
                  </div>
                  <div className="preference-item">
                    <div className="preference-info">
                      <h4>Game Updates</h4>
                      <p>Get notified about new games and features</p>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" />
                      <span className="slider"></span>
                    </label>
                  </div>
                </div>
              </div>

              <div className="section-card">
                <h2>Gaming Preferences</h2>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Favorite Game Genre</label>
                    <select>
                      <option>Action</option>
                      <option>Adventure</option>
                      <option>Racing</option>
                      <option>Sports</option>
                      <option>Strategy</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Preferred Booking Time</label>
                    <select>
                      <option>Morning (9AM - 12PM)</option>
                      <option>Afternoon (12PM - 5PM)</option>
                      <option>Evening (5PM - 9PM)</option>
                      <option>Any Time</option>
                    </select>
                  </div>
                </div>
                <div className="form-actions">
                  <button className="btn-primary">
                    Save Preferences
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="profile-footer">
        <div className="footer-content">
          <p>&copy; 2024 GameZone. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Profile;
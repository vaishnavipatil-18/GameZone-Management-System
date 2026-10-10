import React, { useState, useEffect } from 'react';
import './ManageEmployees.css';

const ManageEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    employeeId: '',
    name: '',
    email: '',
    phone: '',
    role: 'Attendant',
    status: 'Active'
  });

  const roleOptions = ['Manager', 'Attendant', 'Technician', 'Cashier'];
  const statusOptions = ['Active', 'Inactive'];

  // ✅ Fetch employees from backend
  const fetchEmployees = async () => {
    setLoading(true);
    try {
      console.log("📡 Fetching employees from backend...");
      const response = await fetch('http://localhost:5000/api/employees');
      const data = await response.json();
      
      if (response.ok) {
        console.log("✅ Employees fetched:", data.employees.length);
        setEmployees(data.employees);
      } else {
        console.error("❌ Error fetching employees:", data.message);
        alert('Failed to fetch employees');
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      alert('Network error. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load employees on component mount
  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ Add new employee to backend
  const handleAddEmployee = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log("📤 Adding employee to backend...", formData);
      const response = await fetch('http://localhost:5000/api/employees', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log("✅ Employee added successfully");
        alert('Employee added successfully!');
        fetchEmployees(); // Refresh the list
        resetForm();
        setShowAddForm(false);
      } else {
        alert(data.message || 'Failed to add employee');
      }
    } catch (error) {
      console.error("❌ Error adding employee:", error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Edit employee
  const handleEditEmployee = (employee) => {
    setEditingEmployee(employee);
    setFormData({
      employeeId: employee.employeeId,
      name: employee.name,
      email: employee.email,
      phone: employee.phone,
      role: employee.role,
      status: employee.status
    });
    setShowAddForm(true);
  };

  // ✅ Update employee in backend
  const handleUpdateEmployee = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log("📤 Updating employee in backend...", formData);
      const response = await fetch(`http://localhost:5000/api/employees/${editingEmployee._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log("✅ Employee updated successfully");
        alert('Employee updated successfully!');
        fetchEmployees(); // Refresh the list
        resetForm();
        setShowAddForm(false);
      } else {
        alert(data.message || 'Failed to update employee');
      }
    } catch (error) {
      console.error("❌ Error updating employee:", error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete employee from backend
  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employee?')) {
      setLoading(true);
      
      try {
        console.log("🗑️ Deleting employee from backend...", employeeId);
        const response = await fetch(`http://localhost:5000/api/employees/${employeeId}`, {
          method: 'DELETE'
        });

        const data = await response.json();
        
        if (response.ok) {
          console.log("✅ Employee deleted successfully");
          alert('Employee deleted successfully!');
          fetchEmployees(); // Refresh the list
        } else {
          alert(data.message || 'Failed to delete employee');
        }
      } catch (error) {
        console.error("❌ Error deleting employee:", error);
        alert('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      employeeId: '',
      name: '',
      email: '',
      phone: '',
      role: 'Attendant',
      status: 'Active'
    });
    setEditingEmployee(null);
  };

  const cancelForm = () => {
    setShowAddForm(false);
    resetForm();
  };

  // Filter employees based on search
  const filteredEmployees = employees.filter(employee =>
    employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeClass = (status) => {
    return status === 'Active' ? 'status-active' : 'status-inactive';
  };

  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'Manager': return 'role-manager';
      case 'Technician': return 'role-technician';
      case 'Cashier': return 'role-cashier';
      default: return 'role-attendant';
    }
  };

  return (
    <div className="manage-employees">
      <div className="employees-header">
        <div className="header-left">
          <h1>Manage Employees</h1>
          <p>Add, edit, and manage employee accounts</p>
        </div>
        <div className="header-right">
          <button 
            className="btn-primary"
            onClick={() => setShowAddForm(true)}
            disabled={loading}
          >
            <i className="fas fa-user-plus"></i>
            {loading ? 'Loading...' : 'Add Employee'}
          </button>
        </div>
      </div>

      {/* Add/Edit Employee Form */}
      {showAddForm && (
        <div className="employee-form-overlay">
          <div className="employee-form">
            <div className="form-header">
              <h2>{editingEmployee ? 'Edit Employee' : 'Add New Employee'}</h2>
              <button className="close-btn" onClick={cancelForm}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={editingEmployee ? handleUpdateEmployee : handleAddEmployee}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Employee ID *</label>
                  <input
                    type="text"
                    name="employeeId"
                    value={formData.employeeId}
                    onChange={handleInputChange}
                    required
                    placeholder="E001"
                  />
                </div>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="John Doe"
                  />
                </div>
                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    placeholder="employee@gamezone.com"
                  />
                </div>
                <div className="form-group">
                  <label>Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
                <div className="form-group">
                  <label>Role *</label>
                  <select
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                  >
                    {roleOptions.map(role => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={cancelForm}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : (editingEmployee ? 'Update' : 'Add Employee')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Employees List */}
      <div className="employees-content">
        <div className="employees-toolbar">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="employees-stats">
            <span>Total: {employees.length}</span>
            <span>Active: {employees.filter(e => e.status === 'Active').length}</span>
          </div>
        </div>

        <div className="employees-table-container">
          {loading ? (
            <div className="loading-message">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading employees...</p>
            </div>
          ) : (
            <table className="employees-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Contact</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.length > 0 ? (
                  filteredEmployees.map(employee => (
                    <tr key={employee._id}>
                      <td className="employee-id">{employee.employeeId}</td>
                      <td className="employee-name">
                        <strong>{employee.name}</strong>
                        <div className="employee-email">{employee.email}</div>
                      </td>
                      <td className="employee-role">
                        <span className={`role-badge ${getRoleBadgeClass(employee.role)}`}>
                          {employee.role}
                        </span>
                      </td>
                      <td className="employee-contact">
                        {employee.phone}
                      </td>
                      <td className="employee-status">
                        <span className={`status-badge ${getStatusBadgeClass(employee.status)}`}>
                          {employee.status}
                        </span>
                      </td>
                      <td className="employee-actions">
                        <button 
                          className="btn-edit"
                          onClick={() => handleEditEmployee(employee)}
                          title="Edit"
                          disabled={loading}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="btn-delete"
                          onClick={() => handleDeleteEmployee(employee._id)}
                          title="Delete"
                          disabled={loading}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="no-employees">
                      <div className="no-employees-message">
                        <i className="fas fa-users"></i>
                        <p>No employees found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default ManageEmployees;
import React, { useState, useEffect } from 'react';
import './ManageMachines.css';

const ManageMachines = () => {
  // Sample games data for assignment (you can fetch this from backend later)
  const availableGames = [
    { id: 'G001', name: 'Virtual Racing Pro' },
    { id: 'G002', name: 'Zombie Survival' },
    { id: 'G003', name: 'Space Explorers' },
    { id: 'G004', name: 'Football Champions' },
    { id: 'G005', name: 'Puzzle Master' }
  ];

  const [machines, setMachines] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingMachine, setEditingMachine] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    machineId: '',
    name: '',
    gameId: '',
    status: 'Available',
    maintenanceInfo: '',
    lastMaintenance: '',
    nextMaintenance: ''
  });

  const statusOptions = ['Available', 'Under Maintenance', 'Out of Service', 'Reserved', 'In Use'];
  const maintenanceTypes = ['Routine Check', 'Hardware Repair', 'Software Update', 'Controller Replacement', 'Display Issues', 'No Issues'];

  // ✅ Fetch machines from backend
  const fetchMachines = async () => {
    setLoading(true);
    try {
      console.log("📡 Fetching machines from backend...");
      const response = await fetch('http://localhost:5000/api/machines');
      const data = await response.json();
      
      if (response.ok) {
        console.log("✅ Machines fetched:", data.machines.length);
        setMachines(data.machines);
      } else {
        console.error("❌ Error fetching machines:", data.message);
        alert('Failed to fetch machines');
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      alert('Network error. Please check if backend is running.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Load machines on component mount
  useEffect(() => {
    fetchMachines();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Update game name when game ID is selected
      ...(name === 'gameId' && {
        gameName: availableGames.find(game => game.id === value)?.name || ''
      })
    }));
  };

  // ✅ Add new machine to backend
  const handleAddMachine = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const selectedGame = availableGames.find(game => game.id === formData.gameId);
      const machineData = {
        ...formData,
        gameName: selectedGame?.name || 'No Game Assigned'
      };

      console.log("📤 Adding machine to backend...", machineData);
      const response = await fetch('http://localhost:5000/api/machines', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(machineData)
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log("✅ Machine added successfully");
        alert('Machine added successfully!');
        fetchMachines(); // Refresh the list
        resetForm();
        setShowAddForm(false);
      } else {
        alert(data.message || 'Failed to add machine');
      }
    } catch (error) {
      console.error("❌ Error adding machine:", error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Edit machine
  const handleEditMachine = (machine) => {
    setEditingMachine(machine);
    setFormData({
      machineId: machine.machineId,
      name: machine.name,
      gameId: machine.gameId,
      status: machine.status,
      maintenanceInfo: machine.maintenanceInfo,
      lastMaintenance: machine.lastMaintenance ? machine.lastMaintenance.split('T')[0] : '',
      nextMaintenance: machine.nextMaintenance ? machine.nextMaintenance.split('T')[0] : ''
    });
    setShowAddForm(true);
  };

  // ✅ Update machine in backend
  const handleUpdateMachine = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const selectedGame = availableGames.find(game => game.id === formData.gameId);
      const machineData = {
        ...formData,
        gameName: selectedGame?.name || 'No Game Assigned'
      };

      console.log("📤 Updating machine in backend...", machineData);
      const response = await fetch(`http://localhost:5000/api/machines/${editingMachine._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(machineData)
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log("✅ Machine updated successfully");
        alert('Machine updated successfully!');
        fetchMachines(); // Refresh the list
        resetForm();
        setShowAddForm(false);
      } else {
        alert(data.message || 'Failed to update machine');
      }
    } catch (error) {
      console.error("❌ Error updating machine:", error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete machine from backend
  const handleDeleteMachine = async (machineId) => {
    if (window.confirm('Are you sure you want to delete this machine?')) {
      setLoading(true);
      
      try {
        console.log("🗑️ Deleting machine from backend...", machineId);
        const response = await fetch(`http://localhost:5000/api/machines/${machineId}`, {
          method: 'DELETE'
        });

        const data = await response.json();
        
        if (response.ok) {
          console.log("✅ Machine deleted successfully");
          alert('Machine deleted successfully!');
          fetchMachines(); // Refresh the list
        } else {
          alert(data.message || 'Failed to delete machine');
        }
      } catch (error) {
        console.error("❌ Error deleting machine:", error);
        alert('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  // ✅ Update machine status in backend
  const handleStatusChange = async (machineId, newStatus) => {
    setLoading(true);
    
    try {
      console.log("🔄 Updating machine status...", machineId, newStatus);
      const response = await fetch(`http://localhost:5000/api/machines/${machineId}/status`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log("✅ Machine status updated successfully");
        fetchMachines(); // Refresh the list
      } else {
        alert(data.message || 'Failed to update machine status');
      }
    } catch (error) {
      console.error("❌ Error updating machine status:", error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Assign game to machine in backend
  const assignGameToMachine = async (machineId, gameId) => {
    setLoading(true);
    
    try {
      const selectedGame = availableGames.find(game => game.id === gameId);
      const gameData = {
        gameId: gameId,
        gameName: selectedGame?.name || 'No Game Assigned'
      };

      console.log("🎮 Assigning game to machine...", machineId, gameData);
      const response = await fetch(`http://localhost:5000/api/machines/${machineId}/game`, {
        method: 'PATCH',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(gameData)
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log("✅ Game assigned to machine successfully");
        fetchMachines(); // Refresh the list
      } else {
        alert(data.message || 'Failed to assign game to machine');
      }
    } catch (error) {
      console.error("❌ Error assigning game to machine:", error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      machineId: '',
      name: '',
      gameId: '',
      status: 'Available',
      maintenanceInfo: '',
      lastMaintenance: '',
      nextMaintenance: ''
    });
    setEditingMachine(null);
  };

  const cancelForm = () => {
    setShowAddForm(false);
    resetForm();
  };

  // Filter machines based on search term
  const filteredMachines = machines.filter(machine =>
    machine.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    machine.machineId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    machine.gameName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    machine.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Available': return 'status-available';
      case 'Under Maintenance': return 'status-maintenance';
      case 'Out of Service': return 'status-out-of-service';
      case 'Reserved': return 'status-reserved';
      case 'In Use': return 'status-in-use';
      default: return 'status-available';
    }
  };

  const getGameAssignmentOptions = (currentMachineId) => {
    return availableGames.filter(game => 
      !machines.some(machine => 
        machine._id !== currentMachineId && machine.gameId === game.id
      ) || game.id === machines.find(m => m._id === currentMachineId)?.gameId
    );
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <div className="manage-machines">
      <div className="machines-header">
        <div className="header-left">
          <h1>Manage Machines</h1>
          <p>Add, edit, and manage gaming machines and their assignments</p>
        </div>
        <div className="header-right">
          <button 
            className="btn-primary"
            onClick={() => setShowAddForm(true)}
            disabled={loading}
          >
            <i className="fas fa-plus"></i>
            {loading ? 'Loading...' : 'Add New Machine'}
          </button>
        </div>
      </div>

      {/* Add/Edit Machine Form */}
      {showAddForm && (
        <div className="machine-form-overlay">
          <div className="machine-form">
            <div className="form-header">
              <h2>{editingMachine ? 'Edit Machine' : 'Add New Machine'}</h2>
              <button className="close-btn" onClick={cancelForm}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={editingMachine ? handleUpdateMachine : handleAddMachine}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Machine ID *</label>
                  <input
                    type="text"
                    name="machineId"
                    value={formData.machineId}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., M001"
                  />
                </div>
                <div className="form-group">
                  <label>Machine Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., Racing Station 1"
                  />
                </div>
                <div className="form-group">
                  <label>Assign Game</label>
                  <select
                    name="gameId"
                    value={formData.gameId}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Game</option>
                    {availableGames.map(game => (
                      <option key={game.id} value={game.id}>
                        {game.name} ({game.id})
                      </option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Status *</label>
                  <select
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    required
                  >
                    {statusOptions.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Maintenance Type</label>
                  <select
                    name="maintenanceInfo"
                    value={formData.maintenanceInfo}
                    onChange={handleInputChange}
                  >
                    <option value="">Select Maintenance Type</option>
                    {maintenanceTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Last Maintenance</label>
                  <input
                    type="date"
                    name="lastMaintenance"
                    value={formData.lastMaintenance}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="form-group">
                  <label>Next Maintenance</label>
                  <input
                    type="date"
                    name="nextMaintenance"
                    value={formData.nextMaintenance}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={cancelForm}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : (editingMachine ? 'Update Machine' : 'Add Machine')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Machines List */}
      <div className="machines-content">
        <div className="machines-toolbar">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search machines by name, ID, game, or status..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="machines-stats">
            <span>Total Machines: {machines.length}</span>
            <span>Available: {machines.filter(m => m.status === 'Available').length}</span>
            <span>Under Maintenance: {machines.filter(m => m.status === 'Under Maintenance').length}</span>
          </div>
        </div>

        <div className="machines-table-container">
          {loading ? (
            <div className="loading-message">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading machines...</p>
            </div>
          ) : (
            <table className="machines-table">
              <thead>
                <tr>
                  <th>Machine ID</th>
                  <th>Machine Name</th>
                  <th>Assigned Game</th>
                  <th>Status</th>
                  <th>Maintenance Info</th>
                  <th>Last Maintenance</th>
                  <th>Next Maintenance</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMachines.length > 0 ? (
                  filteredMachines.map(machine => (
                    <tr key={machine._id}>
                      <td className="machine-id">{machine.machineId}</td>
                      <td className="machine-name">
                        <strong>{machine.name}</strong>
                      </td>
                      <td className="assigned-game">
                        <select
                          value={machine.gameId || ''}
                          onChange={(e) => assignGameToMachine(machine._id, e.target.value)}
                          className="game-assignment"
                          disabled={loading}
                        >
                          <option value="">No Game</option>
                          {getGameAssignmentOptions(machine._id).map(game => (
                            <option key={game.id} value={game.id}>
                              {game.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="machine-status">
                        <select
                          value={machine.status}
                          onChange={(e) => handleStatusChange(machine._id, e.target.value)}
                          className={`status-select ${getStatusBadgeClass(machine.status)}`}
                          disabled={loading}
                        >
                          {statusOptions.map(status => (
                            <option key={status} value={status}>{status}</option>
                          ))}
                        </select>
                      </td>
                      <td className="maintenance-info">
                        {machine.maintenanceInfo || 'No issues'}
                      </td>
                      <td className="last-maintenance">
                        {formatDate(machine.lastMaintenance)}
                      </td>
                      <td className="next-maintenance">
                        {formatDate(machine.nextMaintenance)}
                      </td>
                      <td className="machine-actions">
                        <button 
                          className="btn-edit"
                          onClick={() => handleEditMachine(machine)}
                          title="Edit Machine"
                          disabled={loading}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="btn-delete"
                          onClick={() => handleDeleteMachine(machine._id)}
                          title="Delete Machine"
                          disabled={loading}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="8" className="no-machines">
                      <div className="no-machines-message">
                        <i className="fas fa-desktop"></i>
                        <p>No machines found</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>

        {/* Quick Status Overview */}
        <div className="status-overview">
          <h3>Machine Status Overview</h3>
          <div className="status-cards">
            <div className="status-card available">
              <div className="status-count">
                {machines.filter(m => m.status === 'Available').length}
              </div>
              <div className="status-label">Available</div>
            </div>
            <div className="status-card maintenance">
              <div className="status-count">
                {machines.filter(m => m.status === 'Under Maintenance').length}
              </div>
              <div className="status-label">Under Maintenance</div>
            </div>
            <div className="status-card in-use">
              <div className="status-count">
                {machines.filter(m => m.status === 'In Use').length}
              </div>
              <div className="status-label">In Use</div>
            </div>
            <div className="status-card out-of-service">
              <div className="status-count">
                {machines.filter(m => m.status === 'Out of Service').length}
              </div>
              <div className="status-label">Out of Service</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageMachines;
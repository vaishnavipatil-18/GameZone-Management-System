import React, { useState, useEffect } from 'react';
import './ManageGames.css';

const ManageGames = () => {
  const [games, setGames] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGame, setEditingGame] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    gameId: '',
    name: '',
    cost: '',
    type: '',
    maintenanceStatus: 'Operational',
    description: ''
  });

  const gameTypes = ['Racing', 'Action', 'Adventure', 'Sports', 'Puzzle', 'Strategy', 'Simulation'];
  const maintenanceStatuses = ['Operational', 'Maintenance', 'Out of Service', 'Under Repair'];

  // ✅ Fetch games from backend
  const fetchGames = async () => {
    setLoading(true);
    try {
      console.log("📡 Fetching games from backend...");
      const response = await fetch('http://localhost:5000/api/games');
      const data = await response.json();
      
      if (response.ok) {
        console.log("✅ Games fetched:", data.games.length);
        setGames(data.games);
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

  // ✅ Load games on component mount
  useEffect(() => {
    fetchGames();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ✅ Add new game to backend
  const handleAddGame = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log("📤 Adding game to backend...", formData);
      const response = await fetch('http://localhost:5000/api/games', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log("✅ Game added successfully");
        alert('Game added successfully!');
        fetchGames(); // Refresh the list
        cancelForm();
      } else {
        alert(data.message || 'Failed to add game');
      }
    } catch (error) {
      console.error("❌ Error adding game:", error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Edit game
  const handleEditGame = (game) => {
    setEditingGame(game);
    setFormData({
      gameId: game.gameId,
      name: game.name,
      cost: game.cost.toString(),
      type: game.type,
      maintenanceStatus: game.maintenanceStatus,
      description: game.description
    });
    setShowAddForm(true);
  };

  // ✅ Update game in backend
  const handleUpdateGame = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log("📤 Updating game in backend...", formData);
      const response = await fetch(`http://localhost:5000/api/games/${editingGame._id}`, {
        method: 'PUT',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (response.ok) {
        console.log("✅ Game updated successfully");
        alert('Game updated successfully!');
        fetchGames(); // Refresh the list
        cancelForm();
      } else {
        alert(data.message || 'Failed to update game');
      }
    } catch (error) {
      console.error("❌ Error updating game:", error);
      alert('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Delete game from backend
  const handleDeleteGame = async (gameId) => {
    if (window.confirm('Are you sure you want to delete this game?')) {
      setLoading(true);
      
      try {
        console.log("🗑️ Deleting game from backend...", gameId);
        const response = await fetch(`http://localhost:5000/api/games/${gameId}`, {
          method: 'DELETE'
        });

        const data = await response.json();
        
        if (response.ok) {
          console.log("✅ Game deleted successfully");
          alert('Game deleted successfully!');
          fetchGames(); // Refresh the list
        } else {
          alert(data.message || 'Failed to delete game');
        }
      } catch (error) {
        console.error("❌ Error deleting game:", error);
        alert('Network error. Please try again.');
      } finally {
        setLoading(false);
      }
    }
  };

  const cancelForm = () => {
    setShowAddForm(false);
    setEditingGame(null);
    setFormData({
      gameId: '',
      name: '',
      cost: '',
      type: '',
      maintenanceStatus: 'Operational',
      description: ''
    });
  };

  // Filter games based on search term
  const filteredGames = games.filter(game =>
    game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.gameId.toLowerCase().includes(searchTerm.toLowerCase()) ||
    game.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Operational': return 'status-operational';
      case 'Maintenance': return 'status-maintenance';
      case 'Out of Service': return 'status-out-of-service';
      case 'Under Repair': return 'status-under-repair';
      default: return 'status-operational';
    }
  };

  return (
    <div className="manage-games">
      <div className="games-header">
        <div className="header-left">
          <h1>Manage Games</h1>
          <p>Add, edit, and manage your game collection</p>
        </div>
        <div className="header-right">
          <button 
            className="btn-primary"
            onClick={() => setShowAddForm(true)}
            disabled={loading}
          >
            <i className="fas fa-plus"></i>
            {loading ? 'Loading...' : 'Add New Game'}
          </button>
        </div>
      </div>

      {/* Add/Edit Game Form */}
      {showAddForm && (
        <div className="game-form-overlay">
          <div className="game-form">
            <div className="form-header">
              <h2>{editingGame ? 'Edit Game' : 'Add New Game'}</h2>
              <button className="close-btn" onClick={cancelForm}>
                <i className="fas fa-times"></i>
              </button>
            </div>
            <form onSubmit={editingGame ? handleUpdateGame : handleAddGame}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Game ID *</label>
                  <input
                    type="text"
                    name="gameId"
                    value={formData.gameId}
                    onChange={handleInputChange}
                    required
                    placeholder="e.g., G001"
                  />
                </div>
                <div className="form-group">
                  <label>Game Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    placeholder="Enter game name"
                  />
                </div>
                <div className="form-group">
                  <label>Cost per Hour (in rupees) *</label>
                  <input
                    type="number"
                    name="cost"
                    value={formData.cost}
                    onChange={handleInputChange}
                    required
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                  />
                </div>
                <div className="form-group">
                  <label>Game Type *</label>
                  <select
                    name="type"
                    value={formData.type}
                    onChange={handleInputChange}
                    required
                  >
                    <option value="">Select Type</option>
                    {gameTypes.map(type => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Maintenance Status</label>
                  <select
                    name="maintenanceStatus"
                    value={formData.maintenanceStatus}
                    onChange={handleInputChange}
                  >
                    {maintenanceStatuses.map(status => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    placeholder="Enter game description"
                    rows="3"
                  />
                </div>
              </div>
              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={cancelForm}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" disabled={loading}>
                  {loading ? 'Saving...' : (editingGame ? 'Update Game' : 'Add Game')}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Games List */}
      <div className="games-content">
        <div className="games-toolbar">
          <div className="search-box">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search games by name, ID, or type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="games-stats">
            <span>Total Games: {games.length}</span>
            <span>Operational: {games.filter(g => g.maintenanceStatus === 'Operational').length}</span>
          </div>
        </div>

        <div className="games-table-container">
          {loading ? (
            <div className="loading-message">
              <i className="fas fa-spinner fa-spin"></i>
              <p>Loading games...</p>
            </div>
          ) : (
            <table className="games-table">
              <thead>
                <tr>
                  <th>Game ID</th>
                  <th>Game Name</th>
                  <th>Type</th>
                  <th>Cost/Hour</th>
                  <th>Status</th>
                  <th>Description</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredGames.length > 0 ? (
                  filteredGames.map(game => (
                    <tr key={game._id}>
                      <td className="game-id">{game.gameId}</td>
                      <td className="game-name">
                        <strong>{game.name}</strong>
                      </td>
                      <td className="game-type">
                        <span className="type-badge">{game.type}</span>
                      </td>
                      <td className="game-cost">${game.cost}</td>
                      <td className="game-status">
                        <span className={`status-badge ${getStatusBadgeClass(game.maintenanceStatus)}`}>
                          {game.maintenanceStatus}
                        </span>
                      </td>
                      <td className="game-description">
                        {game.description}
                      </td>
                      <td className="game-actions">
                        <button 
                          className="btn-edit"
                          onClick={() => handleEditGame(game)}
                          title="Edit Game"
                          disabled={loading}
                        >
                          <i className="fas fa-edit"></i>
                        </button>
                        <button 
                          className="btn-delete"
                          onClick={() => handleDeleteGame(game._id)}
                          title="Delete Game"
                          disabled={loading}
                        >
                          <i className="fas fa-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="no-games">
                      <div className="no-games-message">
                        <i className="fas fa-gamepad"></i>
                        <p>No games found</p>
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

export default ManageGames;
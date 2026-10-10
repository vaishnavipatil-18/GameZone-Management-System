import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const BrowseGames = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Game categories with images
  const categories = [
    { id: 'all', name: 'All Games', icon: '🎮' },
    { id: 'vr', name: 'VR Games', icon: '🥽' },
    { id: 'racing', name: 'Racing', icon: '🏎️' },
    { id: 'fps', name: 'FPS', icon: '🔫' },
    { id: 'arcade', name: 'Arcade', icon: '🕹️' },
    { id: 'sports', name: 'Sports', icon: '⚽' },
    { id: 'adventure', name: 'Adventure', icon: '🗺️' }
  ];

  // Sample games data with images
  const games = [
    {
      id: 1,
      name: "VR Racing Pro",
      type: "vr",
      category: "VR Racing",
      cost: 25,
      duration: "60 min",
      description: "Immerse yourself in the ultimate VR racing experience with realistic physics and stunning graphics.",
      availability: 3,
      totalMachines: 4,
      image: "🏎️",
      features: ["4K VR Headset", "Motion Simulator", "Multiplayer", "Realistic Physics"],
      rating: 4.8,
      popularity: "high"
    },
    {
      id: 2,
      name: "Zombie Survival VR",
      type: "vr",
      category: "VR Horror",
      cost: 30,
      duration: "45 min",
      description: "Fight hordes of zombies in this intense VR survival horror experience.",
      availability: 2,
      totalMachines: 3,
      image: "🧟",
      features: ["Full Body Tracking", "Haptic Feedback", "Co-op Mode", "Dynamic AI"],
      rating: 4.6,
      popularity: "high"
    },
    {
      id: 3,
      name: "Dance Revolution Extreme",
      type: "arcade",
      category: "Rhythm Game",
      cost: 20,
      duration: "30 min",
      description: "Step to the beat in this classic rhythm dance game with modern updates.",
      availability: 5,
      totalMachines: 6,
      image: "💃",
      features: ["LED Dance Floor", "Multiplayer", "100+ Songs", "Fitness Tracking"],
      rating: 4.4,
      popularity: "medium"
    },
    {
      id: 4,
      name: "FPS Arena Pro",
      type: "fps",
      category: "First Person Shooter",
      cost: 35,
      duration: "90 min",
      description: "Competitive FPS gaming with professional-grade equipment and tournaments.",
      availability: 4,
      totalMachines: 5,
      image: "🎯",
      features: ["240Hz Monitors", "Mechanical Keyboards", "Tournament Ready", "Team Play"],
      rating: 4.7,
      popularity: "high"
    },
    {
      id: 5,
      name: "Racing Simulator GT",
      type: "racing",
      category: "Racing Simulator",
      cost: 40,
      duration: "60 min",
      description: "Professional racing simulator with force feedback and realistic cockpit.",
      availability: 2,
      totalMachines: 3,
      image: "🏁",
      features: ["Force Feedback", "Triple Monitor", "Real Cockpit", "100+ Tracks"],
      rating: 4.9,
      popularity: "high"
    },
    {
      id: 6,
      name: "VR Adventure Quest",
      type: "vr",
      category: "VR Adventure",
      cost: 28,
      duration: "45 min",
      description: "Embark on an epic VR adventure through mystical lands and ancient ruins.",
      availability: 1,
      totalMachines: 2,
      image: "🌌",
      features: ["Room Scale VR", "Puzzle Solving", "Story Driven", "Exploration"],
      rating: 4.5,
      popularity: "medium"
    },
    {
      id: 7,
      name: "Basketball Pro",
      type: "sports",
      category: "Sports Simulator",
      cost: 18,
      duration: "30 min",
      description: "Realistic basketball simulation with motion tracking and score challenges.",
      availability: 6,
      totalMachines: 8,
      image: "🏀",
      features: ["Motion Tracking", "Score Challenges", "Multiplayer", "Skill Levels"],
      rating: 4.2,
      popularity: "medium"
    },
    {
      id: 8,
      name: "Pinball Wizard",
      type: "arcade",
      category: "Classic Arcade",
      cost: 15,
      duration: "20 min",
      description: "Classic pinball experience with modern digital enhancements and multiple tables.",
      availability: 8,
      totalMachines: 10,
      image: "🎱",
      features: ["Multiple Tables", "Online Leaderboards", "Classic & Modern", "Multiplayer"],
      rating: 4.3,
      popularity: "low"
    },
    {
      id: 9,
      name: "Cyberpunk Shooter",
      type: "fps",
      category: "Futuristic FPS",
      cost: 32,
      duration: "60 min",
      description: "Futuristic FPS set in a cyberpunk world with advanced weapons and gadgets.",
      availability: 3,
      totalMachines: 4,
      image: "🔮",
      features: ["Futuristic Weapons", "Cyber Enhancements", "Story Mode", "Co-op"],
      rating: 4.6,
      popularity: "medium"
    },
    {
      id: 10,
      name: "Virtual Tennis Pro",
      type: "sports",
      category: "VR Sports",
      cost: 22,
      duration: "30 min",
      description: "Realistic tennis simulation in VR with professional coaching modes.",
      availability: 4,
      totalMachines: 5,
      image: "🎾",
      features: ["VR Motion Tracking", "Coach Mode", "Tournament Play", "Fitness Tracking"],
      rating: 4.4,
      popularity: "medium"
    }
  ];

  // Filter games based on category and search term
  const filteredGames = games.filter(game => {
    const matchesCategory = selectedCategory === 'all' || game.type === selectedCategory;
    const matchesSearch = game.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         game.category.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const getAvailabilityColor = (availability, total) => {
    const ratio = availability / total;
    if (ratio >= 0.5) return '#00ff00';
    if (ratio >= 0.25) return '#ffff00';
    return '#ff4444';
  };

  const getPopularityColor = (popularity) => {
    switch (popularity) {
      case 'high': return '#ff4444';
      case 'medium': return '#ffff00';
      case 'low': return '#00ff00';
      default: return '#cccccc';
    }
  };

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
          <Link to="/customer/booking" style={styles.navLink}>Book Game</Link>
          <Link to="/customer/my-bookings" style={styles.navLink}>My Bookings</Link>
          <Link to="/customer/profile" style={styles.navLink}>Profile</Link>
        </div>
      </nav>

      {/* Main Content */}
      <div style={styles.container}>
        {/* Header */}
        <div style={styles.header}>
          <h1 style={styles.title}>Browse Games</h1>
          <p style={styles.subtitle}>Discover our amazing collection of gaming experiences</p>
        </div>

        {/* Search Bar */}
        <div style={styles.searchContainer}>
          <div style={styles.searchBox}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search games by name, description, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={styles.searchInput}
            />
          </div>
        </div>

        {/* Categories */}
        <div style={styles.categoriesSection}>
          <h2 style={styles.sectionTitle}>Categories</h2>
          <div style={styles.categoriesGrid}>
            {categories.map(category => (
              <button
                key={category.id}
                style={{
                  ...styles.categoryCard,
                  ...(selectedCategory === category.id && styles.activeCategory)
                }}
                onClick={() => setSelectedCategory(category.id)}
              >
                <div style={styles.categoryIcon}>{category.icon}</div>
                <span style={styles.categoryName}>{category.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Games Grid */}
        <div style={styles.gamesSection}>
          <div style={styles.resultsInfo}>
            <h2 style={styles.sectionTitle}>
              {selectedCategory === 'all' ? 'All Games' : 
               categories.find(cat => cat.id === selectedCategory)?.name}
            </h2>
            <p style={styles.resultsCount}>
              {filteredGames.length} game{filteredGames.length !== 1 ? 's' : ''} found
            </p>
          </div>

          {filteredGames.length > 0 ? (
            <div style={styles.gamesGrid}>
              {filteredGames.map(game => (
                <div key={game.id} style={styles.gameCard}>
                  {/* Game Header */}
                  <div style={styles.gameHeader}>
                    <div style={styles.gameImage}>
                      {game.image}
                    </div>
                    <div style={styles.gameBasicInfo}>
                      <h3 style={styles.gameName}>{game.name}</h3>
                      <p style={styles.gameCategory}>{game.category}</p>
                      <div style={styles.rating}>
                        <span style={styles.stars}>{'⭐'.repeat(Math.floor(game.rating))}</span>
                        <span style={styles.ratingText}>({game.rating})</span>
                      </div>
                    </div>
                  </div>

                  {/* Game Description */}
                  <p style={styles.gameDescription}>{game.description}</p>

                  {/* Features */}
                  <div style={styles.features}>
                    {game.features.slice(0, 3).map((feature, index) => (
                      <span key={index} style={styles.featureTag}>
                        {feature}
                      </span>
                    ))}
                    {game.features.length > 3 && (
                      <span style={styles.moreFeatures}>
                        +{game.features.length - 3} more
                      </span>
                    )}
                  </div>

                  {/* Game Details */}
                  <div style={styles.gameDetails}>
                    <div style={styles.detailRow}>
                      <span>Duration:</span>
                      <span>{game.duration}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span>Cost:</span>
                      <span style={styles.cost}>${game.cost}</span>
                    </div>
                    <div style={styles.detailRow}>
                      <span>Availability:</span>
                      <span style={{ color: getAvailabilityColor(game.availability, game.totalMachines) }}>
                        {game.availability}/{game.totalMachines} machines
                      </span>
                    </div>
                    <div style={styles.detailRow}>
                      <span>Popularity:</span>
                      <span style={{ color: getPopularityColor(game.popularity) }}>
                        {game.popularity.charAt(0).toUpperCase() + game.popularity.slice(1)}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={styles.actionButtons}>
                    <Link 
                      to="/customer/booking" 
                      state={{ gameId: game.id }}
                      style={styles.bookButton}
                    >
                      Book Now
                    </Link>
                    <button style={styles.detailsButton}>
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>🎮</div>
              <h3>No Games Found</h3>
              <p>Try adjusting your search or select a different category.</p>
              <button 
                style={styles.clearFiltersButton}
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                }}
              >
                Clear Filters
              </button>
            </div>
          )}
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
            <Link to="/customer/booking" style={styles.footerLink}>Book Game</Link>
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

// Styles
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
    maxWidth: '1400px',
    margin: '0 auto',
    padding: '2rem'
  },
  header: {
    textAlign: 'center',
    marginBottom: '3rem'
  },
  title: {
    fontSize: '2.5rem',
    fontWeight: 'bold',
    background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    marginBottom: '1rem'
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#cccccc',
    margin: 0
  },
  searchContainer: {
    marginBottom: '3rem',
    display: 'flex',
    justifyContent: 'center'
  },
  searchBox: {
    position: 'relative',
    width: '100%',
    maxWidth: '600px'
  },
  searchIcon: {
    position: 'absolute',
    left: '1rem',
    top: '50%',
    transform: 'translateY(-50%)',
    fontSize: '1.2rem'
  },
  searchInput: {
    width: '100%',
    padding: '1rem 1rem 1rem 3rem',
    borderRadius: '25px',
    border: '2px solid #00ffff',
    background: 'rgba(0, 0, 0, 0.5)',
    color: 'white',
    fontSize: '1rem',
    outline: 'none'
  },
  categoriesSection: {
    marginBottom: '3rem'
  },
  sectionTitle: {
    fontSize: '2rem',
    color: '#00ffff',
    marginBottom: '1.5rem',
    textAlign: 'center'
  },
  categoriesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
    gap: '1rem',
    maxWidth: '1000px',
    margin: '0 auto'
  },
  categoryCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid #333',
    borderRadius: '15px',
    padding: '1.5rem 1rem',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '0.5rem'
  },
  activeCategory: {
    background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
    borderColor: '#00ffff',
    color: '#000000'
  },
  categoryIcon: {
    fontSize: '2.5rem'
  },
  categoryName: {
    fontSize: '1rem',
    fontWeight: '500',
    textAlign: 'center'
  },
  gamesSection: {
    marginBottom: '3rem'
  },
  resultsInfo: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '2rem',
    flexWrap: 'wrap',
    gap: '1rem'
  },
  resultsCount: {
    color: '#cccccc',
    fontSize: '1.1rem'
  },
  gamesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))',
    gap: '2rem'
  },
  gameCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    borderRadius: '15px',
    padding: '1.5rem',
    border: '1px solid rgba(0, 255, 255, 0.1)',
    transition: 'all 0.3s ease',
    display: 'flex',
    flexDirection: 'column',
    gap: '1rem'
  },
  gameHeader: {
    display: 'flex',
    gap: '1rem',
    alignItems: 'flex-start'
  },
  gameImage: {
    fontSize: '3rem',
    width: '80px',
    height: '80px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'rgba(0, 255, 255, 0.1)',
    borderRadius: '10px',
    flexShrink: 0
  },
  gameBasicInfo: {
    flex: 1
  },
  gameName: {
    color: '#ffffff',
    margin: '0 0 0.5rem 0',
    fontSize: '1.3rem'
  },
  gameCategory: {
    color: '#00ffff',
    margin: '0 0 0.5rem 0',
    fontSize: '0.9rem',
    fontWeight: '500'
  },
  rating: {
    display: 'flex',
    alignItems: 'center',
    gap: '0.5rem'
  },
  stars: {
    color: '#ffff00'
  },
  ratingText: {
    color: '#cccccc',
    fontSize: '0.9rem'
  },
  gameDescription: {
    color: '#cccccc',
    margin: 0,
    fontSize: '0.95rem',
    lineHeight: '1.5'
  },
  features: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.5rem'
  },
  featureTag: {
    background: 'rgba(0, 255, 255, 0.1)',
    color: '#00ffff',
    padding: '0.3rem 0.8rem',
    borderRadius: '15px',
    fontSize: '0.8rem',
    border: '1px solid rgba(0, 255, 255, 0.3)'
  },
  moreFeatures: {
    color: '#cccccc',
    fontSize: '0.8rem',
    fontStyle: 'italic'
  },
  gameDetails: {
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '10px',
    padding: '1rem'
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
    fontWeight: 'bold',
    fontSize: '1.1rem'
  },
  actionButtons: {
    display: 'flex',
    gap: '0.5rem'
  },
  bookButton: {
    background: 'linear-gradient(45deg, #00ffff, #ff00ff)',
    color: '#000000',
    border: 'none',
    padding: '0.8rem 1.5rem',
    borderRadius: '20px',
    fontWeight: 'bold',
    cursor: 'pointer',
    textDecoration: 'none',
    textAlign: 'center',
    flex: 1,
    transition: 'all 0.3s ease'
  },
  detailsButton: {
    background: 'transparent',
    color: '#00ffff',
    border: '1px solid #00ffff',
    padding: '0.8rem 1.5rem',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    flex: 1
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
  clearFiltersButton: {
    background: 'transparent',
    color: '#00ffff',
    border: '1px solid #00ffff',
    padding: '0.8rem 1.5rem',
    borderRadius: '20px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginTop: '1rem'
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

export default BrowseGames;
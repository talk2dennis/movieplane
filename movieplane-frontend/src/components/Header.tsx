// src/components/Header.tsx
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './css/Header.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useNavigate } from 'react-router-dom';
import {
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import ProfilePicture from './ProfilePicture';


export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();


  // function to handle movie search
  const handleSearch = async () => {
    if (query.trim() === '') {
      alert('Please enter a search term');
      return;
    }
    // redirect to search results page with query
    navigate(`/search/${encodeURIComponent(query)}`);
    // reset query input
    setQuery('');
  }


  const handleLogout = () => {
    logout();
  };


  return (
    <header className="app-header">
      <div className="logo-container">
        <div className='logo'>🎬</div>
        <h1 className="app-title">MoviePlane</h1>
      </div>

      <div className="search-bar">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search movies..."
          className='search-input'
        />
        <div className="search-icon" onClick={handleSearch}><FontAwesomeIcon icon={faSearch} color='white ' /></div>
      </div>

      <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <NavLink to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Home</NavLink>

        {!isAuthenticated && (
          <>
            <NavLink to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Login</NavLink>
            <NavLink to="/register" className="nav-link" onClick={() => setMenuOpen(false)}>Register</NavLink>
          </>
        )}

        {isAuthenticated && (
          <>
            <NavLink to="/favorites" className="nav-link" onClick={() => setMenuOpen(false)}>
              Favorites
              <span className='notification'> ({user?.favorites_movies?.length ?? 0})</span>
            </NavLink>
            <NavLink to="/watchlist" className="nav-link" onClick={() => setMenuOpen(false)}>
              Watchlist
              <span className='notification'> ({user?.watchlist_movies?.length ?? 0})</span>
            </NavLink>
            <button className="nav-link logout-btn" onClick={handleLogout}>Logout</button>
            <div style={{ width: '40px', height: '40px' }} onClick={() => { window.location.href = '/profile'; }} >
              <ProfilePicture imageUrl={user?.profilePicture ?? null} username={user?.username.split('@')[0] ?? ''} />
            </div>
          </>
        )}
      </nav>

      <button
        className={`hamburger ${menuOpen ? 'open' : ''}`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <span />
        <span />
        <span />
      </button>
    </header>
  );
}

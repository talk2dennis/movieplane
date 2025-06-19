// src/components/Header.tsx
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './css/Header.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch
} from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);


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
        <div className="search-icon"><FontAwesomeIcon icon={faSearch} color='white ' /></div>
        <input type="text" placeholder="Search movies..." className='search-input' />
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
              <span className='notification'> ({user?.favorites_movies.length})</span>
            </NavLink>
            <NavLink to="/watchlist" className="nav-link" onClick={() => setMenuOpen(false)}>
              Watchlist
              <span className='notification'> ({user?.watchlist_movies.length})</span>
            </NavLink>
            <NavLink to={`/profile`} className="nav-link" onClick={() => setMenuOpen(false)}><span className="nav-link user-greeting">{user?.username}</span></NavLink>
            <button className="nav-link logout-btn" onClick={handleLogout}>Logout</button>
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

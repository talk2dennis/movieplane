// src/components/Header.tsx
import { NavLink } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './css/Header.css';

export default function Header() {
  const { user, logout, isAuthenticated } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
//   const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  return (
    <header className="app-header">
      <div className="logo">🎬 MoviePlane</div>

      <div className="search-bar">
        <input type="text" placeholder="Search movies..." />
      </div>

      <nav className={`nav-links ${menuOpen ? 'open' : ''}`}>
        <NavLink to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Home</NavLink>
        <NavLink to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Movies</NavLink>
        <NavLink to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Series</NavLink>
        <NavLink to="/" className="nav-link" onClick={() => setMenuOpen(false)}>Kids</NavLink>

        {!isAuthenticated && (
          <>
            <NavLink to="/login" className="nav-link" onClick={() => setMenuOpen(false)}>Login</NavLink>
            <NavLink to="/register" className="nav-link" onClick={() => setMenuOpen(false)}>Register</NavLink>
          </>
        )}

        {isAuthenticated && (
          <>
            <NavLink to={`/profile`} className="nav-link" onClick={() => setMenuOpen(false)}><span className="nav-link user-greeting">Welcome, {user?.username}</span></NavLink>
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

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Header.css';

function Header() {
  const location = useLocation();

  return (
    <header className="header">
      <div className="header-content">
        <Link to="/" className="logo">
          PropertyFinder
        </Link>
        <nav className="nav-tabs">
          <Link 
            to="/" 
            className={`nav-tab ${location.pathname === '/' ? 'active' : ''}`}
          >
            Properties
          </Link>
          <Link 
            to="/favorites" 
            className={`nav-tab ${location.pathname === '/favorites' ? 'active' : ''}`}
          >
            Favorites
          </Link>
        </nav>
      </div>
    </header>
  );
}

export default Header;

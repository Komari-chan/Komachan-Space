import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  const handleMenuClick = (e) => {
    e.stopPropagation();
  };

  return (
    <div>
      <div className={`navbar ${isOpen ? 'open' : ''}`} onClick={handleMenuClick}>
        <div className="menu-toggle" onClick={toggleMenu}>
          ☰
        </div>
        <div className="menu-content">
          <Link to="/" onClick={closeMenu}>Home</Link>
          <Link to="/pixiv" onClick={closeMenu}>Pixiv</Link>
          <Link to="/github" onClick={closeMenu}>GitHub</Link>
          <Link to="/features" onClick={closeMenu}>Features</Link>
          <Link to="/generate" onClick={closeMenu}>Generate</Link>
        </div>
      </div>
      {isOpen && <div className="overlay" onClick={closeMenu}></div>}
    </div>
  );
}

export default Navbar;

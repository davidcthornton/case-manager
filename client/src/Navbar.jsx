// Navbar.jsx
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();

  return (
    <nav style={styles.navbar}>
      <Link to="/" style={linkStyle(location.pathname === '/')}>🏠 Home</Link>
      <Link to="/newcase" style={linkStyle(location.pathname === '/newcase')}>➕ New Case</Link>
      
      
    </nav>
  );
};

const styles = {
  navbar: {
    display: 'flex',
    gap: '20px',
    backgroundColor: '#f3f3f3',
    padding: '12px 24px',
    borderBottom: '1px solid #ccc',
  },
};

const linkStyle = (isActive) => ({
  textDecoration: 'none',
  fontWeight: isActive ? 'bold' : 'normal',
  color: isActive ? '#007bff' : '#333',
});

export default Navbar;

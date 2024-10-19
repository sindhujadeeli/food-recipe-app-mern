import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../App.css';

const Navbar = ({ token, logout }) => {
  const navigate = useNavigate();

  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {!token ? (
          <>
            {/* <li>
              <Link to="/login">Login</Link>
            </li> */}
            <li>
              <Link to="/login">Login</Link>
            </li>
          </>
        ) : (
          <li>
            <button onClick={() => { logout(); navigate('/'); }}>Logout</button>
          </li>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;

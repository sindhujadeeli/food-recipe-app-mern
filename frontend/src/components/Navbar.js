import { Link, useNavigate } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Navbar = ({ token, logout, username }) => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  const checkUserRole = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      const response = await axios.get('http://localhost:5000/api/auth/user', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIsAdmin(response.data.isAdmin); 
    }
  };

  useEffect(() => {
    checkUserRole();
  }, []);


  return (
    <nav className="navbar">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {token ? (
          <>
            <li>
              <Link to="/recipes">Recipes</Link>
            </li>
            <li>
            {isAdmin && (
              <Link to="/admins">Admins</Link>
            )}
            </li>
            <li>
              <span id="username">Welcome, {username}</span>
            </li>
            <li>
              <button onClick={() => { logout(); navigate('/'); }}>Logout</button>
            </li>
          </>
        ) : (
          <>
            <li>
              <Link to="/login">Login</Link>
            </li>
            <li>
              <Link to="/register">Sign Up</Link>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;

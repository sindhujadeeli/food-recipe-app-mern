import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Register from './components/Register';
import Login from './components/Login';
import ProtectedAPI from './components/ProtectedAPI';
import Navbar from './components/Navbar';
import RecipeCRUD from './components/RecipeCRUD';  // For admin users to manage recipes
import ViewRecipes from './components/ViewRecipes';  // For non-admin users to view recipes
import AdminManagement from './components/AdminManagement';
import { jwtDecode } from 'jwt-decode';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userInfo, setUserInfo] = useState({ username: '', role: '' });

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token); // Decode the token to get user info
      setUserInfo({ username: decodedToken.username, role: decodedToken.role });
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUserInfo({ username: '', role: '' });
  };

  return (
    <Router>
      <div className="App">
        <Navbar token={token} logout={logout} username={userInfo.username} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/login"
            element={
              token ? <Navigate to="/recipes" /> : <Login setToken={setToken} />
            }
          />
          <Route path="/register" element={<Register />} />
          <Route
            path="/recipes"
            element={
              userInfo.role !== 'admin' ? <RecipeCRUD /> : <ViewRecipes />
            }
          />
          <Route
            path="/protected"
            element={
              token ? <ProtectedAPI /> : <Navigate to="/login" />
            }
          />
          <Route path="/admins" element={ userInfo.role !== 'admin' ? <AdminManagement /> : <ViewRecipes />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

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
import EditProfile from './components/EditProfile';
import ChangePassword from './components/ChangePassword';
import ResetPassword from './components/ResetPassword';
function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [userInfo, setUserInfo] = useState({ username: '', role: '' });
  const [username, setUsername] = useState(localStorage.getItem('username'));

  useEffect(() => {
    if (token) {
      const decodedToken = jwtDecode(token); // Decode the token to get user info
      setUserInfo({ username: decodedToken.username, role: decodedToken.role });
      localStorage.setItem('username', decodedToken.username);
      setUsername(decodedToken.username);
    }
  }, [token]);

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUserInfo({ username: '', role: '' });
  };
  const updateUsername = (newUsername) => {
    setUsername(newUsername);
    localStorage.setItem('username', newUsername); // Update localStorage
  };

  return (
    <Router>
      <div className="App">
        <Navbar token={token} logout={logout} username={username} />
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
          <Route path="/profile" element={ <EditProfile updateUsername={updateUsername} />} />
          <Route path="/change-password" element={<ChangePassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />  // For non-admin users to change their password
        </Routes>
      </div>
    </Router>
  );
}

export default App;

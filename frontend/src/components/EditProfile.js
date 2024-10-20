import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toastr from 'toastr';
import './EditProfile.css'; // Import your CSS
import { useNavigate } from 'react-router-dom';

const EditProfile = ({ updateUsername }) => {
  const [user, setUser] = useState({ username: '', email: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [newUsername, setNewUsername] = useState('');
  const navigate = useNavigate();

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/profile', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUser(response.data); // Set user details from response
      setIsLoading(false); // Stop loading
      console.log(user);
      
    } catch (error) {
      console.error('Error fetching user profile:', error);
      toastr.error('Failed to load profile.');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUser({ ...user, [name]: value });
  };

  const updateUserProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:5000/api/auth/profile', user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (response.status === 200) {        
        updateUsername(response.data.username);
        toastr.success('Profile updated successfully!');
        navigate('/');
      } else {
        toastr.error('Failed to update profile.');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toastr.error('Failed to update profile.');
    }
  };

  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>
      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <form onSubmit={updateUserProfile}>
          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              type="text"
              id="username"
              name="username"
              value={user.username}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={user.email}
              onChange={handleInputChange}
              disabled
            />
          </div>

          <button type="submit" className="save-button">Save Changes</button>
        </form>
      )}
    </div>
  );
};

export default EditProfile;

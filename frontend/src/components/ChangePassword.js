import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ChangePassword.css'; // Import CSS

const ResetPassword = () => {
  const navigate = useNavigate();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Regular expression for strong password validation
  const passwordRegex = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  const handlePasswordChange = async (e) => {
    e.preventDefault();

    // Check if the new password matches the confirm password
    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      return;
    }

    // Check if the new password meets strong password requirements
    if (!passwordRegex.test(newPassword)) {
      setError(
        'Password must be at least 8 characters long, include one uppercase, one lowercase, one number, and one special character'
      );
      return;
    }

    // Call the backend API to update the password
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put('http://localhost:5000/api/auth/change-password', {
        currentPassword,
        newPassword,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data.success) {
        setSuccess('Password has been updated successfully');
        navigate('/profile'); // Redirect to profile page or wherever needed
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('Please check the current password once');
    }
  };

  return (
    <div className="reset-password-container">
      <h2>Reset Password</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      
      <form onSubmit={handlePasswordChange}>
        <div className="form-group">
          <label>Current Password</label>
          <input 
            type="password" 
            value={currentPassword} 
            onChange={(e) => setCurrentPassword(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label>New Password</label>
          <input 
            type="password" 
            value={newPassword} 
            onChange={(e) => setNewPassword(e.target.value)} 
            required 
          />
        </div>

        <div className="form-group">
          <label>Confirm New Password</label>
          <input 
            type="password" 
            value={confirmPassword} 
            onChange={(e) => setConfirmPassword(e.target.value)} 
            required 
          />
        </div>

        <button type="submit" className="submit-btn">Reset Password</button>
      </form>

      <p className="password-instructions">
        Password must be at least 8 characters long, include one uppercase letter, one lowercase letter, one number, and one special character.
      </p>
    </div>
  );
};

export default ResetPassword;

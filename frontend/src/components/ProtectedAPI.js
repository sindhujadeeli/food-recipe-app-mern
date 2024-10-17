import React, { useState, useEffect } from 'react';
import axios from 'axios';

const ProtectedAPI = () => {
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const fetchProtectedData = async () => {
    try {
      // Retrieve the token from localStorage
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No token found, please log in first');
        return;
      }

      // Make request to protected API
      const response = await axios.get('http://localhost:5000/api/auth/protected', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      setMessage(response.data.message);
    } catch (err) {
      setError('Access denied or token expired');
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProtectedData();
  }, []);

  return (
    <div>
      <h2>Protected API</h2>
      {error ? <p style={{ color: 'red' }}>{error}</p> : <p>{message}</p>}
    </div>
  );
};

export default ProtectedAPI;

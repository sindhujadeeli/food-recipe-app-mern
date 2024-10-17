import React, { useState } from 'react';
import axios from 'axios';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });

  const { username, email, password } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/auth/register', formData);

      // Check if response.data exists and log it
      if (response && response.data) {
        console.log('User registered:', response.data);
      } else {
        console.error('Unexpected response format:', response);
      }

    } catch (error) {
      // Check if error.response exists
      if (error.response && error.response.data) {
        console.error('Error during registration:', error.response.data);
      } else {
        console.error('Unexpected error:', error.message);
      }
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          name="username" 
          value={username} 
          placeholder="Username" 
          onChange={handleChange} 
          required 
        />
        <input 
          type="email" 
          name="email" 
          value={email} 
          placeholder="Email" 
          onChange={handleChange} 
          required 
        />
        <input 
          type="password" 
          name="password" 
          value={password} 
          placeholder="Password" 
          onChange={handleChange} 
          required 
        />
        <button type="submit">Register</button>
      </form>
    </div>
  );
};

export default Register;

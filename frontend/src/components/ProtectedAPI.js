import React, { useEffect, useState } from 'react';
import { Typography, Container, Box, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../App.css';

const Protected = () => {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/auth/protected', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        setMessage(response.data.message);
      } catch (error) {
        console.error(error);
        navigate('/');
      }
    };
    fetchData();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Typography variant="h4">Protected Page</Typography>
        <Typography variant="body1" sx={{ mt: 2 }}>{message}</Typography>
        <Button
          variant="contained"
          sx={{ mt: 4 }}
          onClick={handleLogout}
        >
          Logout
        </Button>
      </Box>
    </Container>
  );
};

export default Protected;

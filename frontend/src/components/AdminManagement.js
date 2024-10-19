import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import toastr from 'toastr';
import './AdminManagement.css'; // Import CSS for styling
import axios from 'axios';

const AdminManagement = () => {
  const [admins, setAdmins] = useState([]); // Initialize as an empty array
  const [newAdmin, setNewAdmin] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [deletingAdminId, setDeletingAdminId] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    // Fetch admins from the API (replace with your API endpoint)
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/auth/admins', {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', // Adjusted content type
        },
      });
      // Set admins to the data array returned from the API
      setAdmins(response.data); 
    } catch (error) {
      console.error('Error fetching admins:', error);
      toastr.error('Failed to fetch admins.'); // Notify user about the error
    }
  };

  const handleInputChange = (e) => {
    setNewAdmin(e.target.value);
  };

  const addAdmin = async (e) => {
    e.preventDefault();
    // Add new admin logic (replace with your API endpoint)
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/auth/admin', {
        email: newAdmin, // Send the name directly
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', // Adjusted content type
        },
      });

      if (response.status === 200) { // Check for successful creation
        toastr.success('Admin added successfully!');
        setNewAdmin('');
        closeAddModal();
        fetchAdmins(); 
      } else {
        toastr.error('Failed to add admin.');
      }
    } catch (error) {
      console.error('Error adding admin:', error);
      toastr.error('Failed to add admin.');
    }
  };

  const openDeleteConfirmation = (adminId) => {
    setDeletingAdminId(adminId);
    setIsConfirmDeleteOpen(true);
  };

  const deleteAdmin = async () => {
    // Delete admin logic (replace with your API endpoint)
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:5000/api/auth/admin/${deletingAdminId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json', // Adjusted content type
        },
      });

      if (response.status === 200) { // Check for successful deletion
        toastr.success('Admin deleted successfully!');
        closeDeleteConfirmation();
        fetchAdmins(); // Refresh the admin list
      } else {
        toastr.error('Failed to delete admin.');
      }
    } catch (error) {
      console.error('Error deleting admin:', error);
      toastr.error(error.response.data);
    }
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
    setNewAdmin('');
  };

  const closeDeleteConfirmation = () => {
    setIsConfirmDeleteOpen(false);
    setDeletingAdminId(null);
  };

  return (
    <div>
      <h2>Admin Management</h2>
      <button onClick={() => setIsAddModalOpen(true)} className="add-admin-button">Add New Admin</button>
      
      <ul className="admin-list">
      {admins.map((admin) => (
        <li key={admin.email} className="admin-item">
          <div>
            <span className="admin-username">{admin.username}</span>
            <span className="admin-email">{admin.email}</span>
          </div>
          <button onClick={() => openDeleteConfirmation(admin.email)} className="delete-admin-button">Delete</button>
        </li>
      ))}
    </ul>


      {/* Add Admin Modal */}
      <Modal isOpen={isAddModalOpen} onRequestClose={closeAddModal} className="modal">
        <h2>Add Admin</h2>
        <form onSubmit={addAdmin}>
          <input 
            type="text" 
            placeholder="Admin Name" 
            value={newAdmin} 
            onChange={handleInputChange} 
            required 
          />
          <button type="submit">Add Admin</button>
        </form>
        <button onClick={closeAddModal}>Close</button>
      </Modal>

      {/* Confirmation Modal for Deletion */}
      <Modal isOpen={isConfirmDeleteOpen} onRequestClose={closeDeleteConfirmation} className="modal">
        <h2>Confirm Deletion</h2>
        <p>Are you sure you want to delete this admin?</p>
        <button onClick={deleteAdmin}>Confirm</button>
        <button onClick={closeDeleteConfirmation}>Cancel</button>
      </Modal>
    </div>
  );
};

export default AdminManagement;

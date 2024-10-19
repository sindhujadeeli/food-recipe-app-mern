import React from 'react';
import Modal from 'react-modal';

const ConfirmationModal = ({ isOpen, onRequestClose, onConfirm }) => {
  return (
    <Modal isOpen={isOpen} onRequestClose={onRequestClose}>
      <h2>Confirm Deletion</h2>
      <p>Are you sure you want to delete this recipe?</p>
      <button onClick={onConfirm}>Yes, Delete</button>
      <button onClick={onRequestClose}>Cancel</button>
    </Modal>
  );
};

export default ConfirmationModal;

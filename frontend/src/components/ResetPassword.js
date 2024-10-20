import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './ResetPassword.css'; // Import CSS
import toastr from 'toastr';
const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [genCode, setGenCode] = useState('');
  const handleSendCode = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('http://localhost:5000/api/auth/send-code', { email });
      if (response.data.success) {
        setStep(2); // Move to verification step
        setSuccess('Verification code sent to your email.');
        setGenCode(response.data.code); // Store the generated code for later verification
        toastr.success('Verification code sent to your email.');
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('An error occurred while sending the verification code.');
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match.');
      return;
    }

    if (code.toString() !== genCode.toString()) {
      setError('Invalid verification code.');
      toastr.error('Invalid verification code.');
      return;
    }
    try {
      const response = await axios.post('http://localhost:5000/api/auth/verify-code', {
        email,
        code,
        newPassword,
      });
      if (response.data.success) {
        setSuccess('Password reset successfully! You can now log in.');
        toastr.success('Password reset successfully! You can now log in.');
        navigate('/login'); // Redirect to login page
      } else {
        setError(response.data.message);
      }
    } catch (err) {
      setError('An error occurred while resetting the password.');
    }
  };

  return (
    <div className="reset-password-container">
      <h2>{step === 1 ? 'Send Verification Code' : 'Reset Password'}</h2>
      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}
      
      {step === 1 ? (
        <form onSubmit={handleSendCode}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-btn">Send Verification Code</button>
        </form>
      ) : (
        <form onSubmit={handleVerifyCode}>
          <div className="form-group">
            <label>Verification Code</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value)}
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
      )}
    </div>
  );
};

export default ResetPassword;

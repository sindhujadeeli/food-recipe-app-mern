const express = require('express');
const { resetPassword,registerUser,userProfile,changePassword, editProfile,loginUser, protectedRoute, checkRole, getAllAdmins,createAdmin, deleteAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/protected', protect, protectedRoute);
router.get('/user', protect, checkRole);


router.get('/admins', protect, getAllAdmins);
router.post('/admin', protect, createAdmin);
router.delete('/admin/:email', protect, deleteAdmin);
router.get('/profile', protect, userProfile);
router.put('/profile', protect, editProfile);
router.put('/change-password', protect, changePassword);
router.put('/reset-password', protect, resetPassword);
router.post('/reset-password', resetPassword);

module.exports = router;
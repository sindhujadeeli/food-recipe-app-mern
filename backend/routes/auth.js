const express = require('express');
const { resetPassword,registerUser,sendVerificationCode,userProfile,changePassword, editProfile,loginUser, protectedRoute, checkRole, getAllAdmins,createAdmin, deleteAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const {
    createRecipe,
    updateRecipe,
    getAllRecipes,
    deleteRecipe,
    toggleFavourite,
    getFavoriteRecipes
} = require('../controllers/recipeController'); 

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/protected', protect, protectedRoute);
router.get('/user', protect, checkRole);


router.post('/recipe', protect,createRecipe);
router.get('/recipe', protect, getAllRecipes);
router.put('/recipe/:id', protect, updateRecipe);
router.delete('/recipe/:id',protect, deleteRecipe);
router.put('/recipe/:id/toggle-favorite', protect, toggleFavourite);
router.get('/recipe/favorites', protect, getFavoriteRecipes);

router.get('/admins', protect, getAllAdmins);
router.post('/admin', protect, createAdmin);
router.delete('/admin/:email', protect, deleteAdmin);
router.get('/profile', protect, userProfile);
router.put('/profile', protect, editProfile);
router.put('/change-password', protect, changePassword);
router.put('/reset-password', protect, resetPassword);

router.post('/send-code', sendVerificationCode);
router.post('/verify-code', resetPassword);

module.exports = router;
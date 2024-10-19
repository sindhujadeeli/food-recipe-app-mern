const express = require('express');
const { registerUser, loginUser, protectedRoute, checkRole, getAllAdmins,createAdmin, deleteAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/protected', protect, protectedRoute);
router.get('/user', protect, checkRole);

const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');  // Middleware to check role

const {
    createRecipe,
    updateRecipe,
    getAllRecipes,
    deleteRecipe
} = require('../controllers/recipeController'); // Import controller functions

// Create a new recipe (Admin only)
router.post('/recipe', protect,createRecipe);

// Get all recipes (accessible by all users)
router.get('/recipe', protect, getAllRecipes);
router.put('/recipe/:id', protect, updateRecipe);
// Delete a recipe (Admin only)
router.delete('/recipe/:id',protect, deleteRecipe);

router.get('/admins', protect, getAllAdmins);
router.post('/admin', protect, createAdmin);
router.delete('/admin/:id', protect, deleteAdmin);
module.exports = router;
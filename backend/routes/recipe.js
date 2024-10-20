const express = require('express');
const router = express.Router();
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');  // Middleware to check role

const {
    createRecipe,
    getAllRecipes,
    deleteRecipe
} = require('../controllers/recipeController'); // Import controller functions

// Create a new recipe (Admin only)
router.post('/', verifyToken,createRecipe);

// Get all recipes (accessible by all users)
router.get('/', verifyToken, getAllRecipes);

// Delete a recipe (Admin only)
router.delete('/:id',verifyToken, deleteRecipe);

module.exports = router;
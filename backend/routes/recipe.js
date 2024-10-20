const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');

const {
    createRecipe,
    updateRecipe,
    getAllRecipes,
    deleteRecipe,
    toggleFavourite,
    getFavoriteRecipes
} = require('../controllers/recipeController'); 

router.post('/', protect,createRecipe);
router.get('/', protect, getAllRecipes);
router.put('/:id', protect, updateRecipe);
router.delete('/:id',protect, deleteRecipe);
router.put('/:id/toggle-favorite', protect, toggleFavourite);
router.get('/favorites', protect, getFavoriteRecipes);

module.exports = router;
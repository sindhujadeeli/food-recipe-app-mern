const Recipe = require('../models/Recipe');

// Create a new recipe (Admin only)
exports.createRecipe = async (req, res) => {
    try {
        const { title, description, ingredients, instructions } = req.body;
      
        // Check if the image is present in the request
        if (!req.files || !req.files.image) {
            return res.status(400).json({ error: 'Image is required' });
        }

        // Get the binary image file
        const imageFile = req.files.image;

        // Create a new recipe object with image stored as Buffer
        const recipe = new Recipe({
            title,
            description,
            ingredients,
            instructions,
            createdBy: req.user.email,  // Link to the logged-in user
            image: {
                data: imageFile.data,
                contentType: imageFile.mimetype
            }
        });

        // Save the recipe to the database
        await recipe.save();

        res.status(201).json(recipe);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to create recipe' });
    }
};

exports.updateRecipe = async (req, res) => {
    try {
        const { title, description, ingredients, instructions } = req.body;
        const recipeId = req.params.id;

        // Find the recipe by ID
        let recipe = await Recipe.findById(recipeId);

        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }

        // Update the fields if they are provided in the request body
        if (title) recipe.title = title;
        if (description) recipe.description = description;
        if (ingredients) recipe.ingredients = ingredients;
        if (instructions) recipe.instructions = instructions;

        // Check if a new image is uploaded and update the image field
        if (req.files && req.files.image) {
            const imageFile = req.files.image;
            recipe.image = {
                data: imageFile.data,
                contentType: imageFile.mimetype,
            };
        }

        // Save the updated recipe
        await recipe.save();

        res.status(200).json(recipe);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to update recipe' });
    }
};

// Get all recipes (accessible by all users)
exports.getAllRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find();

        // Convert binary image data to Base64 for each recipe
        const recipesWithBase64Image = recipes.map((recipe) => {
            if (recipe.image && recipe.image.data) {
                // Convert binary data to Base64 string
                const base64Image = recipe.image.data.toString('base64');
                return {
                    ...recipe._doc,  // Spread the rest of the recipe document
                    image: `data:${recipe.image.contentType};base64,${base64Image}` // Construct the image URL
                };
            }
            return recipe;
        });

        res.json(recipesWithBase64Image);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch recipes' });
    }
};


// Delete a recipe (Admin only)
exports.deleteRecipe = async (req, res) => {
    try {
        await Recipe.findByIdAndDelete(req.params.id);
        res.status(204).send();
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete recipe' });
    }
};

exports.toggleFavourite = async (req, res) => {
    const { id } = req.params;
    try {
        // Find the recipe by ID
        const recipe = await Recipe.findById(id);
        if (!recipe) {
            return res.status(404).json({ error: 'Recipe not found' });
        }
        // Toggle the favourite status
        recipe.isFavorite = !recipe.isFavorite;
        await recipe.save();
        res.status(200).json(recipe);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Failed to toggle favourite status' });
    }
};

exports.getFavoriteRecipes = async (req, res) => {
    try {
        const recipes = await Recipe.find({ isFavorite: true });
        // Convert binary image data to Base64 for each recipe
        const recipesWithBase64Image = recipes.map((recipe) => {
            if (recipe.image && recipe.image.data) {
                // Convert binary data to Base64 string
                const base64Image = recipe.image.data.toString('base64');
                return {
                    ...recipe._doc,  // Spread the rest of the recipe document
                    image: `data:${recipe.image.contentType};base64,${base64Image}` // Construct the image URL
                };
            }
            return recipe;
        });
        res.json(recipesWithBase64Image);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch recipes' });
        console.error(err);
    }
};
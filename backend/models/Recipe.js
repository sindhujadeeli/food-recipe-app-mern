const mongoose = require('mongoose');

// Define the schema for a recipe
const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  ingredients: {
    type: [String],  // Array of strings for ingredients
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  image: {
    data: Buffer,
    contentType: String,
},
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,  // Reference to user who created the recipe
    ref: 'User',
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;

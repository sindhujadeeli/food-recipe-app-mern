const mongoose = require('mongoose');

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
    type: [String],  
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
  isFavorite: {
    type: Boolean,
    default: false,
  },
  createdBy: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;

const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    userId: String,
    ingredients: [{
      text: String,
      quantity: Number,
      measure: String,
      food: String,
      weight: Number,
      foodCategory: String,
      foodId: String,
      image: String
    }]
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;
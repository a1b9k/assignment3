const express = require('express');
const router = express.Router();
const axios = require('axios');
const Recipe = require('../models/recipe');

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        if (req.session.user.isAdmin != true){
          next();
        } else {
          res.redirect('/add');
        }
    } else {
        res.redirect('/');
    }
  };

router.get('', isAuthenticated, (req, res) => {
    res.render('index', {recipe: null, error: null});
});

router.post('/', async (req, res) => {
    const query = req.body.q;

    try {
        const response = await axios.get(`https://api.edamam.com/search?q=${query}&app_id=f4aac80e&app_key=92855f96c69164b42731ba90d44e78d5`);
        const data = response.data;

        if (data.hits.length === 0) {
            return res.render('index', { error: 'No recipes found' });
        }

        const recipeData = data.hits[0].recipe;
        const ingredients = recipeData.ingredients;

        const recipe = new Recipe({ 
            userId: req.session.user._id,
            ingredients: ingredients 
        });

        await recipe.save();

        console.log('Recipe saved:', recipeData);

        res.render('index', { recipe: recipeData, error: null });
    } catch (error) {
        console.error('Error fetching recipe:', error);
        res.render('index', { error: 'An error occurred while fetching the recipe' });
    }
});



module.exports = router;
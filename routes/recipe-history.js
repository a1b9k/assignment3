const express = require('express');
const router = express.Router();
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

router.get('', isAuthenticated, async (req, res) => {
    try {
        const recipeHistory = await Recipe.find({ userId: req.session.user._id }).exec();
        const user = req.session.user;
        res.render('recipe-history', { page: 'recipe-history', recipeHistory, user });
    } catch (error) {
        console.error('Error fetching recipe history:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;

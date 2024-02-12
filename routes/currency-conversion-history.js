const express = require('express');
const router = express.Router();
const Converse = require('../models/converse');

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
        const currencyHistory = await Converse.find({ userId: req.session.user._id }).exec();
        const user = req.session.user;
        res.render('currency-conversion-history', { page: 'currency-conversion-history', currencyHistory, user });
    } catch (error) {
        console.error('Error fetching currency conversion history:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

module.exports = router;

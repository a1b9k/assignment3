const express = require('express');
const router = express.Router();
const axios = require('axios');
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

const API_KEY = '4c4e35f52cd6cf1cc7b98166';

async function fetchExchangeRate(fromCurrency, toCurrency) {
    try {
        const response = await axios.get(`https://v6.exchangerate-api.com/v6/${API_KEY}/latest/${fromCurrency}`);
        
        if (response.data && response.data.result === "success" && response.data.conversion_rates) {
            const rate = response.data.conversion_rates[toCurrency];
            if (rate) {
                return rate;
            }
        }
        throw new Error('Failed to fetch exchange rate');
    } catch (error) {
        throw new Error('Failed to fetch exchange rate');
    }
}

async function convertCurrency(req, amount, fromCurrency, toCurrency) {
    if (fromCurrency === toCurrency) {
        return amount;
    }

    const rate = await fetchExchangeRate(fromCurrency, toCurrency);
    if (!rate) {
        throw new Error('Invalid currency');
    }
    const convertedAmount = amount * rate;

    const conversion = new Converse({
        userId: req.session.user._id,
        amount: amount,
        fromCurrency: fromCurrency,
        toCurrency: toCurrency,
        result: convertedAmount
    });

    await conversion.save();

    return convertedAmount;
}

router.get('', isAuthenticated, async (req, res) =>{
    res.render('currency', { amount: null, fromCurrency: null, toCurrency: null, result: null })
});

router.post('/', async (req, res) => {
    const { amount, fromCurrency, toCurrency } = req.body;
    try {
        const result = await convertCurrency(req, parseFloat(amount), fromCurrency, toCurrency);
        console.log(result);
        res.render('currency', { amount, fromCurrency, toCurrency, result });
    } catch (error) {
        res.status(400).send(error.message);
    }
});

module.exports = router;

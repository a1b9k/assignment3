const mongoose = require('mongoose');

const currencyConversionSchema = new mongoose.Schema({
    userId: String,
    amount: Number,
    fromCurrency: String,
    toCurrency: String,
    result: Number,
    createdAt: { type: Date, default: Date.now }
});

const Converse = mongoose.model('Converse', currencyConversionSchema);

module.exports = Converse;
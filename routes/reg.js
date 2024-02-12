const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('', (req, res) => {
  res.render('../views/reg');
});

router.post('/', async (req, res) => {
    const {username, password } = req.body;

    const existingUser = await User.findOne({ username });

    if (existingUser) {
        return res.send('Username is already taken. Please choose another one.');
    } else {

        const newUser = new User({
            username,
            password: password,
            creationDate: new Date(),
            isAdmin: false,
        });

        await newUser.save();

        res.redirect('login');
    }
});

module.exports = router;

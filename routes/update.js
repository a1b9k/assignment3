const express = require('express');
const router = express.Router();
const User = require('../models/user');

const isAuthenticated = (req, res, next) => {
    if (req.session.user) {
        if (req.session.user.isAdmin == true){
            next();
        } else {
            res.redirect('/index');
        }
    } else {
        res.redirect('/');
    }
};

router.get('', isAuthenticated, async (req, res) => {
    try {
        const users = await User.find();

        res.render('../views/update.ejs', { users: users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/', async (req, res) => {
    const id = req.body.id;
    const username = req.body.username;
    const password = req.body.password;
    const creationDate = req.body.createD;
    const deleteDate = req.body.deleteD;
    const isAdmin = req.body.isAdmin === 'on';

    const filter = { _id: id };
    const update = {
        username: username,
        password: password,
        creationDate: creationDate,
        updateDate: new Date(),
        deleteDate: deleteDate,
        isAdmin: isAdmin
    };

    try {
        const result = await User.updateOne(filter, update);
        console.log('Update result:', result);
        res.redirect('/update');
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;
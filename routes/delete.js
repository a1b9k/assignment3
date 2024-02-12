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

        res.render('../views/delete.ejs', { users: users });
    } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).send('Internal Server Error');
    }
});

router.post('/', async (req, res) => {
    const id = req.body.id;
    console.log(id);

    const filter = { _id: id };
    const update = {
        deletionDate: new Date()
    };
    console.log(filter, update);

    try {
        const result = await User.updateOne(filter, update);
        console.log('Update result:', result);
        res.redirect('/delete');
    } catch (error) {
        console.error('Error updating user:', error);
        res.status(500).send('Internal Server Error');
    }
});


module.exports = router;
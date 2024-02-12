const express = require('express');
const router = express.Router();
const User = require('../models/user');

const clearSessionOnLogin = (req, res, next) => {
    req.session.destroy((err) => {
        if (err) {
            console.error('Error destroying session:', err);
        }
        next();
    });
};

router.get('', clearSessionOnLogin, (req, res) => {
  res.render('../views/login');
});

router.post('/', async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (user && user.deletionDate != null){
      console.log("This user has been deleted");
      res.render('login');
  }
  else{
      if (user && user.isAdmin && password == user.password) {
          req.session.userId = user.userId;
          req.session.user = user;
          res.redirect('/add');
      }
      else {
          if (user && password == user.password) {
              req.session.userId = user.userId;
              req.session.user = user;
              res.redirect('/index');
          } else {
              res.redirect('/registration');
          }
      }
  }
});

module.exports = router;

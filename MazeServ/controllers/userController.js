const mongoose = require('mongoose');
const User = require('./../models/user.js');
require('../models/Maze');
const promisify = require('es6-promisify');
const Maze = mongoose.model('Maze');
const mazeWorker = require('./../public/scripts/maze_worker');

// no login just show main page
exports.main = async (req, res) => {
  console.log("In the main logic of user because root URL /user was found");
  res.render('mainUser', { title: 'Welcome to A maze'});
};

// ask for login
exports.loginForm = (req, res) => {
  res.render('login', { title: 'Login' });
};

// ask registration data
exports.registerForm = (req, res) => {
  res.render('register', { title: 'Register' });
};

// validate registration form
exports.validateRegister = (req, res, next) => {
  if (req.body.name !== null && req.body.name !== undefined && req.body.email !== null && req.body.email != undefined)
  {
    req.sanitizeBody('name');
    req.checkBody('name', 'You must supply a name!').notEmpty();
    req.checkBody('email', 'That Email is not valid!').isEmail();
    req.sanitizeBody('email').normalizeEmail({
      gmail_remove_dots: false,
      remove_extension: false,
      gmail_remove_subaddress: false
    });
    req.checkBody('password', 'Password Cannot be Blank!').notEmpty();
    req.checkBody('password-confirm', 'Confirmed Password cannot be blank!').notEmpty();
    req.checkBody('password-confirm', 'Oops! Your passwords do not match').equals(req.body.password);

    const errors = req.validationErrors();
    if (errors) {
      req.flash('error', errors.map(err => err.msg));
      res.render('register', { title: 'Register', body: req.body, flashes: req.flash() });
      return; // stop the fn from running
    }
    next(); // there were no errors!
  } else
  {
    res.render('register', { title: 'Register' });
  }
};

// register a new user
exports.register = async (req, res, next) => {
  const user = new User({ email: req.body.email, name: req.body.name });
  const register = promisify(User.register, User);
  await register(user, req.body.password);
  next(); // pass to authController.login
};

// edit a user
exports.account = (req, res) => {
  res.render('account', { title: 'Edit Your Account' });
};

// update a user
exports.updateAccount = async (req, res) => {
  const updates = {
    name: req.body.name,
    email: req.body.email
  };

  // do the update
  const user = await User.findOneAndUpdate(
    { _id: req.user._id },
    { $set: updates },
    { new: true, runValidators: true, context: 'query' }
  );
  req.flash('success', 'Updated the profile!');
  res.redirect('back');
};



const mongoose = require('mongoose');
const User = require('./../models/user.js');
// const User = mongoose.model('User'); // same as line above but a different way to get it
const promisify = require('es6-promisify');

'use strict';

// no login just show main page
exports.main = async (req, res) => {
  console.log("In the main logic because root URL was found");

    // if the user is here and they have entered height and width
  // we need to get a maze for the main form 
  // this may be only an example for someone who is going to login
  if (req.body.height !== null && req.body.width  !== null && req.body.height !== undefined && req.body.width  !== undefined)
  {
    //console.log(req.body);
    //console.log("Found request for maze that is " + req.body.height + " by " + req.body.width + " in size!");
    // lets check the size and if ok send us the maze display
    if (req.body.height >= 5 && req.body.width >= 5 && req.body.height <= 20 && req.body.width <= 30) {

      // getting start time.  Only so we can see how long it takes to generate this
      // more for fun than valuable outcome
 
        // this is going to be where I display the maze that was created above
        // I could have created the maze and dipslayed the maze in the same function.


        // This will execute after the promise pays soit is a place to determine how
        // long the maze creation took

        res.render('main', { title: 'Welcome to A maze' });   
    } else
    {
      console.log("Maze found to be too small with requested size " + req.body.height + " x " + req.body.width)
      req.flash('error', 'Your maze size must be greater than 5 x 5 and no larger than 20 x 30 to play!');
      res.render('main', { title: 'Welcome to A maze', flashes: req.flash() });   }
  } else 
  {

    res.render('main', { title: 'Welcome to A maze'});
  }

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

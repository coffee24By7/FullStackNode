const mongoose = require('mongoose');


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


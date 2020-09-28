const mongoose = require('mongoose');
require('../models/Maze');
const Maze = mongoose.model('Maze');
const mazeWorker = require('./../public/scripts/mazeWorker');

// no login just show main page
exports.main = async (req, res) => {
  console.log("In the main logic because root URL was found");

  const maze = new Maze();

  // if the user is here and they have entered height and width
  // we need to get a maze for the main form 
  // this may be only an example for someone who is going to login
  if (req.body.height !== null && req.body.width  !== null && req.body.height !== undefined && req.body.width  !== undefined)
  {
    //console.log(req.body);
    //console.log("Found request for maze that is " + req.body.height + " by " + req.body.width + " in size!");
    // lets check the size and if ok send us the maze display
    if (req.body.height >= 5 && req.body.width >= 5 && req.body.height <= 70 && req.body.width <= 70) {
      maze.width = req.body.width;
      maze.height = req.body.height;

      mazeWorker.getTableMaze(maze.width, maze.height).then((result) => {
          maze.drawing = result;
          res.render('main', { title: 'Welcome to A maze',  maze });
      }).catch((error) => {
          console.log("Error", error);
          response.end("Error: " + error);
      })
    } else
    {
      console.log("Maze found to be too small with requested size " + req.body.height + " x " + req.body.width)
      req.flash('error', 'Your maze size must be greater than 5 x 5 and no larger than 70 x 70 to play!');
      res.render('main', { title: 'Welcome to A maze',  maze, flashes: req.flash() });   }
  } else 
  {
    maze.height = req.body.height;
    maze.width = req.body.width;
    res.render('main', { title: 'Welcome to A maze',  maze});
  }

};

// no login just show main page
exports.myMazes = async (req, res) => {
  console.log("In the myMazes logic because /mazes URL was found");

  const page = req.params.page || 1;
  const limit = 4;
  const skip = (page * limit) - limit;

  // 1. Query the database for a list of all mazes
  const mazesPromise = Maze
    .find()
    .skip(skip)
    .limit(limit)
    .sort({ created: 'desc' });

  const countPromise = Maze.count();

  const [mazes, count] = await Promise.all([mazesPromise, countPromise]);
  const pages = Math.ceil(count / limit);
  if (!mazes.length && skip) {
    req.flash('info', `Hey! You asked for page ${page}. But that doesn't exist. So I put you on page ${pages}`);
    res.redirect(`/mazes/page/${pages}`);
    return;
  }

  res.render('mazes', { title: 'My Mazes', mazes, page, pages, count });

};

'use strict';
 
const maze = require('./PayaMazer.js');
const X = 20,
  Y = 20;
 
console.log(`Generating a maze of ${X} x ${Y}...`);

// getting start time.  Only so we can see how long it takes to generate this
// more for fun than valuable outcome
const origin = new Date().getTime();
 
  // This will execute after the promise pays soit is a place to determine how
  // long the maze creation took
  maze.maze(X, Y).then((m) => {
  const time = new Date().getTime() - origin;
  console.log(`Done in ${time <= 1000 ? time+'ms' : Math.round(time/1000)+'s'}!`);

  // this is going to be where I display the maze that was created above
  // I could have created the maze and dipslayed the maze in the same function.
  maze.display(m, console.log); 
  
  //Here you can pass a given stream (ie: stream) and it's write function;
  //An example could be: maze.display(m, stream.write);
}, (err) => console.error(err));
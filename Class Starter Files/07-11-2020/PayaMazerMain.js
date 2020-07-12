'use strict';
 
const maze = require('./PayaMazer.js');
const X = 20,
  Y = 20;
 
console.log(`Generating a maze of ${X} x ${Y}...`);
const origin = new Date().getTime();
 
maze.maze(X, Y).then((m) => {
  const time = new Date().getTime() - origin;
  console.log(`Done in ${time <= 1000 ? time+'ms' : Math.round(time/1000)+'s'}!`);
  maze.display(m, console.log); 
  
  //Here you can pass a given stream (ie: stream) and it's write function;
  //An example could be: maze.display(m, stream.write);
}, (err) => console.error(err));
/**
 * Generates the maze asynchronously.
 * @param {Number} x Width of the maze.
 * @param {Number} y Height of the maze.
 * @returns {Promise} finished when resolved.
 */
function maze(x,y) {
	return new Promise((resolve, reject) => {
	    // get maximum size to see if the dimensions are legal.  So people don't
	    // pass zero or negative numbers
		let n=x*y-1;
		if (n<0) {
			reject(new Error(`illegal maze dimensions (${x} x ${y} < 1)`));
		} else {
		    // simply building the horizontal and vertical points
			let horiz =[]; for (let j= 0; j<x+1; j++) horiz[j]= [];
			let verti =[]; for (let j= 0; j<x+1; j++) verti[j]= [];
			
			
			let here = [Math.floor(Math.random()*x), Math.floor(Math.random()*y)];
			let path = [here];
			let unvisited = [];
			
			for (let j = 0; j<x+2; j++) {
				unvisited[j] = [];
				for (let k= 0; k<y+1; k++)
					unvisited[j].push(j>0 && j<x+1 && k>0 && (j != here[0]+1 || k != here[1]+1));
			}
			
			// this is the magic point.   we go through the arrays of intersections
			// vertical and horizontal.  Then we decide on a random amount of open space
			// to create a new maze every time it is called even for the same size.
			
			// recall that n is total size. so we will be decrementing
			while (0<n) {
			    
				let potential = [[here[0]+1, here[1]], [here[0],here[1]+1],
						[here[0]-1, here[1]], [here[0],here[1]-1]];
				let neighbors = [];
				
				for (let j = 0; j < 4; j++)
					if (unvisited[potential[j][0]+1][potential[j][1]+1])
						neighbors.push(potential[j]);
						
				if (neighbors.length) {
					n = n-1;
					// by simply making our x,y postive or negative we randomly turn on and off
					// the lines that make up the maze
					let next= neighbors[Math.floor(Math.random()*neighbors.length)];
					unvisited[next[0]+1][next[1]+1]= false;
					if (next[0] == here[0])
						horiz[next[0]][(next[1]+here[1]-1)/2]= true;
					else 
						verti[(next[0]+here[0]-1)/2][next[1]]= true;
					path.push(here = next);
				} else 
					here = path.pop();
					
			}
			
			// payoff by resolving the promise satisfactorly 
			resolve({x: x, y: y, horiz: horiz, verti: verti});
		}
	});
}
 
/**
 * A mere way of generating text.
 * The text (Since it can be large) is generated in a non-blocking way.
 * @param {Object} m Maze object.
 * @param {Stream} writeTo Optinally, include here a function to write to.
 * @returns {Promise} finished when the text is generated.
 */
function display(m, writeTo) {
	return new Promise((resolve, reject) => {
		let text = [];
		for (let j= 0; j<m.x*2+1; j++) {
			let line = [];
			if (0 == j%2)
				for (let k=0; k<m.y*4+1; k++)
					if (0 == k%4) 
						line[k] = '+';
					else
					    // now we apply the negative and false to determine
					    // if our maze wall / floor needs to be printed
						if (j>0 && m.verti[j/2-1][Math.floor(k/4)])
							line[k] = ' ';
						else
							line[k] = '-';
			else
				for (let k=0; k<m.y*4+1; k++)
					if (0 == k%4)
						if (k>0 && m.horiz[(j-1)/2][k/4-1])
							line[k] = ' ';
						else
							line[k] = '|';
					else
						line[k] = ' ';
			if (0 == j) line[1] = line[2] = line[3] = ' ';
			if (m.x*2-1 == j) line[4*m.y]= ' ';
			text.push(line.join('')+'\r\n');
		}
		const OUTPUT = text.join('');
		if (typeof writeTo === 'function')
			writeTo(OUTPUT);
		resolve(OUTPUT);
	});
}
 
module.exports = {
  maze: maze,
  display: display
}


const X = 20,
  Y = 20;
 
console.log(`Generating a maze of ${X} x ${Y}...`);
// getting start time.  Only so we can see how long it takes to generate this
// more for fun than valuable outcome
const origin = new Date().getTime();
 
maze(X, Y).then((m) => {
  // This will execute after the promise pays soit is a place to determine how
  // long the maze creation took
  const time = new Date().getTime() - origin;
  console.log(`Done in ${time <= 1000 ? time+'ms' : Math.round(time/1000)+'s'}!`);
  
  // this is going to be where I display the maze that was created above
  // I could have created the maze and dipslayed the maze in the same function.
  display(m, console.log); 
  
  //Here you can pass a given stream (ie: stream) and it's write function;
  //An example could be: maze.display(m, stream.write);
}, (err) => console.error(err));



 
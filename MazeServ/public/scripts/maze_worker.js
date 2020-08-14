/**
 * Generates the maze asynchronously.
 * @param {Number} x Width of the maze.
 * @param {Number} y Height of the maze.
 * @returns {Promise} finished when resolved.
 * 
 * We change this up a bit from our simple server
 * 
 * We call this buildMaze from the GETMAZE function.   Calling two functions from an imported usage
 * does not yield the correct random results and the maze trail does not work most of the time
 * so for that reason we are calling it from the getMaze instead of directly.
 */
function buildMaze(x,y) {
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
			//console.table({x: x, y: y, horiz: horiz, verti: verti});
			// payoff by resolving the promise satisfactorly 
			resolve({x: x, y: y, horiz: horiz, verti: verti});
		}
	});
}
 
/**
 * A mere way of generating text.
 * The text (Since it can be large) is generated in a non-blocking way.
 * @param {Object} m Maze object.
 * @returns {Promise} finished when the text is generated.
 */
function getMaze(x, y) {
		return new Promise((resolve, reject) => {
			buildMaze(x, y).then((result) => {

			let text = [];
			let line = [];
			for (let j= 0; j<result.x*2+1; j++) {
				if (0 == j%2)
					for (let k=0; k<result.y*4+1; k++)
						if (0 == k%4) 
							line[k] = '+';
						else
							// now we apply the negative and false to determine
							// if our maze wall / floor needs to be printed
							if (j>0 && result.verti[j/2-1][Math.floor(k/4)])
								line[k] = ' ';
							else
								line[k] = '-';
				else
					for (let k=0; k<result.y*4+1; k++)
						if (0 == k%4)
							if (k>0 && result.horiz[(j-1)/2][k/4-1])
								line[k] = ' ';
							else
								line[k] = '|';
						else
							line[k] = ' ';
				if (0 == j) line[1] = line[2] = line[3] = ' ';
				if (result.x*2-1 == j) line[4*result.y]= ' ';
				text.push(line.join('')+'\r\n');
			}
			//console.table(line);
			let ourMaze = text.toString().replace(/,/g, '');
			console.table(ourMaze);
			resolve(ourMaze);
		});
	});

}

// I only want to export two things from this module

// we only export getMaze because we do not want these functions called independently and we 
// dont wan them to be anything goes usage.

module.exports = {
	getMaze: getMaze
}
 
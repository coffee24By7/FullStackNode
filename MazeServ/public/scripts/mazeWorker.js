const StringBuilder = require("string-builder");

/**
 * Generates the maze asynchronously.
 * @param {Number} heigthOfMaze Width of the maze.
 * @param {Number} widthOfMaze Height of the maze.
 * @returns {Promise} finished when resolved.
 * 
 * We change this up a bit from our simple server
 * 
 * We call this buildMaze from the GETMAZE function.   Calling two functions from an imported usage
 * does not yield the correct random results and the maze trail does not work most of the time
 * so for that reason we are calling it from the getMaze instead of directly.
 */
function buildMaze(widthOfMaze, heigthOfMaze) {
	return new Promise((resolve, reject) => {
	    // get maximum size to see if the dimensions are legal.  So people don't
	    // pass zero or negative numbers
		let n=heigthOfMaze*widthOfMaze-1;
		if (n<0) {
			reject(new Error(`illegal maze dimensions (${heigthOfMaze} heigthOfMaze ${widthOfMaze} < 1)`));
		} else {
		    // simply building the horizontal and vertical points
			let horiz =[]; for (let j= 0; j<heigthOfMaze+1; j++) horiz[j]= [];
			let verti =[]; for (let j= 0; j<heigthOfMaze+1; j++) verti[j]= [];
			
			
			let here = [Math.floor(Math.random()*heigthOfMaze), Math.floor(Math.random()*widthOfMaze)];
			let path = [here];
			let unvisited = [];
			
			for (let j = 0; j<heigthOfMaze+2; j++) {
				unvisited[j] = [];
				for (let k= 0; k<widthOfMaze+1; k++)
					unvisited[j].push(j>0 && j<heigthOfMaze+1 && k>0 && (j != here[0]+1 || k != here[1]+1));
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
					// by simply making our heigthOfMaze,widthOfMaze postive or negative we randomly turn on and off
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
			//console.table({heigthOfMaze: heigthOfMaze, widthOfMaze: widthOfMaze, horiz: horiz, verti: verti});
			// payoff by resolving the promise satisfactorly 
			resolve({heigthOfMaze: heigthOfMaze, widthOfMaze: widthOfMaze, horiz: horiz, verti: verti});
		}
	});
}
 
/**
 * A mere way of generating text.
 * The text (Since it can be large) is generated in a non-blocking way.
 * @param {Object} m Maze object.
 * @returns {Promise} finished when the text is generated.
 */
function getTableMaze(heigthOfMaze, widthOfMaze) {
		return new Promise((resolve, reject) => {


			buildMaze(heigthOfMaze, widthOfMaze).then((result) => {
			let sb = new StringBuilder();

			let newColumn = true;

			// table borders
			sb.append("<table class=\"table\">");

			// uncomment for example table that is simple use of the css classes for
			// sb.append("<td class=\"left bottom\">_</td>");
			// sb.append("<td class=\"top bottom\">_</td>");
			// sb.append("<td class=\"top right\">_</td>");

			// sb.append("</tr><tr class=\"noBorder\">");

			// sb.append("<td class=\"top bottom right left\">_</td>");
			// sb.append("<td class=\"top bottom right left\">_</td>");
			// sb.append("<td class=\"right left\">_</td>");

			// sb.append("</tr>");
			// sb.append("</table>");

			// *****************************************************************************
			// ALL ROWS ALL ROWS ALL ROWS ALL ROWS ALL ROWS ALL ROWS ALL ROWS ALL ROWS ALL ROWS
			// *****************************************************************************
			for (let j= 0; j<result.heigthOfMaze*2; j++) 
			{
				// *****************************************************************************
				// NEW ROW NEW ROW NEW ROW NEW ROW NEW ROW NEW ROW NEW ROW NEW ROW NEW ROW NEW ROW
				// *****************************************************************************
				if (0 == j%2)
				{
					sb.append("<tr class=\"tr\">")
					// *****************************************************************************
					// COLUMNS COLUMNS COLUMNS COLUMNS COLUMNS COLUMNS COLUMNS COLUMNS COLUMNS
					// *****************************************************************************
					for (let k=0; k<result.widthOfMaze*4+1; k++)
					{
						if (0 == k%4) 
						{
							if (k > 0)
							{
								if (k < result.widthOfMaze*4)
								{
									sb.append("\"></td><td class=\"");
									newColumn = true;

								} else
								{
									// always have a right wall solid except last position for exit
									if (j < (result.heigthOfMaze*2) - 2)
										sb.append(" right\">");
								
								}
							} else
							{
								// always start with a wall to the left
								newColumn = true;
								sb.append("<td class=\"left ");
							}

							// always have a bottom row solid line
							if (j > (result.heigthOfMaze*2) - 3 )
								sb.append(" bottom");
						}
						else
						{
							// now we apply the negative and false to determine
							// if our maze ceiling needs to be printed
							if (j>0 && result.verti[j/2-1][Math.floor(k/4)])
							{
								// do nothing here because we don't need anything
								k = k;
							}
							else
							{
								if (newColumn)
								{
									if (k>3 || j > 2)
									{
										sb.append(" top");
									}
									newColumn = false;
								} 
							}
						}

						if (0 == k%4)
						{
							if (k>0 && result.horiz[(j)/2][k/4-1])
							{
								// do nothing here because we don't need anything
								k = k;
							}
							else
							{
								if (k!=result.widthOfMaze*4)
									sb.append(" left");
							}
						}

					}
				}
				// *****************************************************************************
				// NEW ROW NEW ROW NEW ROW NEW ROW NEW ROW NEW ROW NEW ROW NEW ROW NEW ROW NEW ROW
				// *****************************************************************************
				if (j > (result.heigthOfMaze*2) - 2 )
				{
					// last cell before closing table.
					sb.append("\"></td></tr>");				
				} else
				{
					sb.append("</tr>");				
				}
			}

			// *****************************************************************************
			// END TABLE END TABLE END TABLE END TABLE END TABLE END TABLE END TABLE END TABLE
			// *****************************************************************************
			sb.append("</table>")
			resolve(sb.toString());
		});
	});

}

/**
 * A mere way of generating text.
 * The text (Since it can be large) is generated in a non-blocking way.
 * @param {Object} m Maze object.
 * @returns {Promise} finished when the text is generated.
 */
function getTextMaze(heigthOfMaze, widthOfMaze) {
	return new Promise((resolve, reject) => {
		buildMaze(heigthOfMaze, widthOfMaze).then((result) => {
		let text = [];
		let line = [];
		for (let j= 0; j<result.heigthOfMaze*2+1; j++) {
			if (0 == j%2)
				for (let k=0; k<result.widthOfMaze*4+1; k++)
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
				for (let k=0; k<result.widthOfMaze*4+1; k++)
					if (0 == k%4)
						if (k>0 && result.horiz[(j-1)/2][k/4-1])
							line[k] = ' ';
						else
							line[k] = '|';
					else
						line[k] = ' ';
			if (0 == j) line[1] = line[2] = line[3] = ' ';
			if (result.heigthOfMaze*2-1 == j) line[4*result.widthOfMaze]= ' ';
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
	getTableMaze: getTableMaze,
	getTextMaze: getTextMaze
}
 
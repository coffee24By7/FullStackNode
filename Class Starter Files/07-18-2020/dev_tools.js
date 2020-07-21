// We use the require directive to load the http module and store 
//the returned HTTP instance into an http variable
var http = require("http");

http.createServer(function (request, response) {
   // Send the HTTP header 
   // HTTP Status: 200 : OK
   // Content Type: text/plain
   response.writeHead(200, {'Content-Type': 'text/plain'});
   // Send the response body which could be anything
   // including quite complex UI and full web applications
   response.write('Hello.  I am your server.  I am your second server\n');

   const ages = [32, 15, 19, 12];
   let responseMsg = "";

   // ???? is there at least one adult in the group?
   const adultPresent = ages.some(age => age >= 18);
   responseMsg = responseMsg + "\n" +  adultPresent;

   console.table(ages);

   // ?? is everyone old enough to drink?
   const allOldEnough = ages.every(age => age >= 19);
   console.log(allOldEnough);   
   responseMsg = responseMsg + "\n" + allOldEnough;
   response.end(responseMsg);
}).listen(8081);

// Console will print the message
console.log('Server running at http://127.0.0.1:8081/');
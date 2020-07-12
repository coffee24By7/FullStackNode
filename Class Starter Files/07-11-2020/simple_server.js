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
   response.end('Hello.  I am your server.  I am your second server\n');
}).listen(8081);

// Console will print the message
console.log('Server running at http://127.0.0.1:8081/');
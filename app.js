//require in nodeJS act as import in JAVA! 
var express = require('express');//creates a express module. Express the behavior of the server.
var app = express();//creates the app.

/*The body-parser module provides the follwoing parsers:
  1) JSON body parser
  2) Raw body parser
  3) Text body parser
  4) URL-encode form body parser

  Creates middleware taht will populate the req.body property
  with the parsed body or provide an error to the callback.

  Note: you might need to do the following in the terminal
  npm install body-parser
 */
var bodyParser = require('body-parser');


var user_data = require('./routes/data'); //this is the route to our data.js file

// parse application/json 
app.use(bodyParser.json());

app.use(express.static('public'));//loads the static files from the path 

app.use('/data',user_data);//when the /data is requested from either from the front end or back end it will go to our data.js file

var server = app.listen(process.env.PORT || 3000,function(){//the server gets created and listens to port 3000
// be accessed on the browser via localhost:portNum
	console.log('Server is on localhost:3000');//prints to the terminal when request from client
});



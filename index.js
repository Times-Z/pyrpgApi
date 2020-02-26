var express = require('express');
 
var hostname = 'localhost';
var port = 9050;
 
var app = express();

var Router = express.Router();

Router.route('/').get(function(req,res){ 
	res.json({message : "Test", methode : req.method});
})

app.use(Router);

app.listen(port, hostname, function(){
	console.log("Server up on http://"+ hostname +":"+port+"\n"); 
});

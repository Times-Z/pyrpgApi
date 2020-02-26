var express = require('express');
 
var hostname = 'localhost';
var port = 8080;
 
var app = express();

var Router = express.Router();

Router.route('/piscines').get(function(req,res){ 
	res.json({message : "Test", methode : req.method});
})

app.use(Router);

app.listen(port, hostname, function(){
	console.log("Server up on http://"+ hostname +":"+port+"\n"); 
});

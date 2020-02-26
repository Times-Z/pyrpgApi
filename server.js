'use strict';

var express = require('express');
 
const HOST = '0.0.0.0';
const PORT = 8080;
 
var app = express();

var Router = express.Router();

Router.route('/').get(function(req,res){ 
	res.json({message : "Test", methode : req.method});
})

app.use(Router);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

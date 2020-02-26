'use strict';

const express = require('express');
const bodyParser = require('body-parser');

const HOST = '0.0.0.0';
const PORT = 8080;
 
var app = express();
var Router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
Router.route('/').post(function(req, res){
	res.json({params: req.body});
});

app.use(Router);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

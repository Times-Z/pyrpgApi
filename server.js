const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Book = require('./books');

mongoose.connect('mongodb://localhost:9081/Book', {useNewUrlParser: true, useUnifiedTopology: true});

const HOST = '0.0.0.0';
// const HOST = '127.0.0.1';
const PORT = 8080;
// const PORT = 9080;

var app = express();
var Router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
Router.route('/login').post(function(req,res) {

});

Router.route('/save').post(function(req, res){
	res.json({params: req.body});
	console.log(req.body);
});

app.use(Router);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

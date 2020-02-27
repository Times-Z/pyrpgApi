'use strict';

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const HOST = '0.0.0.0';
const PORT = 8080;

const schema = mongoose.Schema({
	title : String,
	type : String,
	price : Number
})
module.exports = mongoose.model('books', schema);
const Book = require('./books');
mongoose.connect('mongodb://localhost:9050/Book', {useNewUrlParser: true});
var app = express();
var Router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
Router.route('/').post(function(req, res){
	res.json({params: req.body});
});

app.use(Router);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

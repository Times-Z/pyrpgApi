const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const HOST = '0.0.0.0';
const PORT = 8080;

const schema  = mongoose.Schema({
    title : String,
    type : String,
    number : Number
})
module.exports = mongoose.model('book', schema);

const Books = require('./book');
mongoose.connect('mongodb://localhost:8081/book', {useNewUrlParser: true});
var app = express();
var Router = express.Router();

app.use(bodyParser.urlencoded({ extended: true }));
Router.route('/login').post(function(req,res) {

});

Router.route('/save').post(function(req, res){
	res.json({params: req.body});
});

app.use(Router);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

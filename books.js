const mongoose = require('mongoose');
const schema = mongoose.Schema({
	title : String,
	type : String,
	price : Number
});
module.exports = mongoose.model('books', schema);
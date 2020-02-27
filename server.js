const express = require('express');
const bodyParser = require('body-parser');
const HOST = '0.0.0.0';
const PORT = 8080;
const argon2 = require('argon2');
const sq = require('sqlite3');
sq.verbose();

// Postman json exemple for post route
// {
//     "username": "testuser",
//     "password": "123456"
// }

var db = new sq.Database(__dirname + '/users.db3');
var app = express();
var Router = express.Router();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

Router.route('/login').post(function (req, res) {
	var username = req.body.username
	var password = req.body.password
	db.each("SELECT * FROM users WHERE user_name='" + username + "'", async function (err, user) {
			if (user != '') {
				if (await argon2.verify(user.user_pass, password)) {
					var user = user;
					res.json({
						"DB user" : user,
					});
					console.log(res.statusCode);
				} else {
					res.sendStatus(401);
					console.log(res.statusCode);
				}
			} else {
				res.sendStatus(401);
				console.log(err);
			}
	});
});

Router.route('/save').post(function (req, res) {
	res.json({
		method: req.method,
		"POST params": req.body,
		ip: req.ip,
		code: res.statusCode,
		message: req.statusMessage
	});
});

app.use(Router);

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);

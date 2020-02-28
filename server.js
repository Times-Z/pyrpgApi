const express = require('express');
const bodyParser = require('body-parser');
const HOST = '0.0.0.0';
const PORT = 9080;
const log = require('log-to-file');
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
				} else {
					res.sendStatus(401);
					log('IP : ' + req.ip + ' Return code : ' + res.statusCode + ' On url ' + req.url + ' with method ' + req.method, 'logs/server.log');
				}
			} else {
				res.sendStatus(401);
				log('IP : ' +req.ip+ ' Return code : ' + res.statusCode, 'logs/server.log');
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

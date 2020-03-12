const f = require('./functions/functions');
const express = require('express');
const bodyParser = require('body-parser');
const HOST = '0.0.0.0';
const PORT = 8080;
const log = require('log-to-file');
const argon2 = require('argon2');
const sq = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const KEY = require('./functions/key');

var db = new sq.Database(__dirname + '/db/api.db3');
var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);
app.use('/public', express.static('public'));

app.get('/', (req, res) => {
	res.render('index.html', {
		"page": "home",
	});
});

app.get('/doc', (req, res) => {
	res.render('doc.html', {
		"page": "doc",
	});
});

app.post('/ping', (req, res) => {
	res.json({
		"code": res.statusCode,
		"message": req.statusMessage
	});
});

app.post('/signup', (req, res) => {
	var username = req.body.username;
	var email = req.body.email;
	var rawpass = req.body.password;

	if (!username || !email || !rawpass) {
		res.status(422).json({
			"code": res.statusCode,
			"message": "Missing argument"
		});
		log('IP : ' + req.ip + ' - return code : ' + res.statusCode + ' - on url ' + req.url + ' - with method ' + req.method, 'logs/server.log');
		return;
	};

	db.get("SELECT user_id FROM users WHERE user_mail = ?", [email], async function (err, user) {
		if (user == null) {
			var pass = await argon2.hash(rawpass);
			db.run("INSERT INTO users (user_name, user_pass, user_mail, user_signin_ip, user_last_ip) VALUES (?, ?, ?, ?, ?)", [username, password, email, req.ip, req.ip]);
			res.json({
				"code": res.statusCode,
				"message": req.statusMessage
			});
			return;
		} else {
			res.status(401).json({
				"code": res.statusCode,
				"message": "Email as already exist in DB"
			});
			log('IP : ' + req.ip + ' - return code : ' + res.statusCode + ' - on url ' + req.url + ' - with method ' + req.method, 'logs/server.log');
			return;
		}
	});
});

app.post('/login', (req, res) => {
	var email = req.body.email.toString();
	var password = req.body.password.toString();

	if (!email || !password) {
		res.status(422).json({
			"code": res.statusCode,
			"message": "Missing argument"
		});
		log('IP : ' + req.ip + ' - return code : ' + res.statusCode + ' - on url ' + req.url + ' - with method ' + req.method, 'logs/server.log');
		return
	};

	db.get("SELECT * FROM users WHERE user_mail= ?", [email], async function (err, user) {
		if (user != null) {
			if (await argon2.verify(user.user_pass, password)) {
				var user = user;
				var token = jwt.sign({ "user": user }, KEY.getKey());
				res.json({
					"code": res.statusCode,
					"message": req.statusMessage,
					"data": token
				});
				f.updateTimeLog(db, user.user_id);
				f.updateLastLogIp(db, user.user_id, req.ip)
			} else {
				res.status(401).json({
					"code": res.statusCode,
					"message": "Incorect password"
				});
				log('IP : ' + req.ip + ' - return code : ' + res.statusCode + ' - on url ' + req.url + ' - with method ' + req.method, 'logs/server.log');
			}
		} else {
			res.status(401).json({
				"code": res.statusCode,
				"message": "Incorect email"
			});
			log('IP : ' + req.ip + ' - return code : ' + res.statusCode + ' - on url ' + req.url + ' - with method ' + req.method, 'logs/server.log');
		}
	});
});

app.post('/getSave', f.validateToken, (req, res) => {
	jwt.verify(req.token, KEY.getKey(), (err, authData) => {
		if (err) {
			res.status(403).json({
				"code": res.statusCode,
				"message": "Error append"
			});
		} else {
			db.get("SELECT * FROM saves WHERE user_id = ?", [authData['user']['user_id']], (err, save) => {
				if (err) {
					res.status(500).json({
						"code": res.statusCode,
						"message": err
					});
				} else {
					if (typeof save == 'undefined') {
						save = null;
					};
					res.json({
						code: res.statusCode,
						message: req.statusMessage,
						save
					});
				}
			})
		}
	});
});

app.post('/delSave', f.validateToken, (req,res) => {
	jwt.verify(req.token, KEY.getKey(), (err,authData) => {
		if (err) {
			res.status(403).json({
				"code": res.statusCode,
				"message": "Error append"
			});
		} else {
			console.log(authData);
			db.run("DELETE FROM saves WHERE user_id = ?", [authData['user']['user_id']],(err) => {
				res.json({
					code: res.statusCode,
					message: err
				});
			});
		}
	});
});

app.post('/save', f.validateToken, (req, res) => {
	var data = req.body.save.toString();

	if (!data) {
		res.status(422).json({
			"code": res.statusCode,
			"message": "Missing argument"
		});
		log('IP : ' + req.ip + ' - return code : ' + res.statusCode + ' - on url ' + req.url + ' - with method ' + req.method, 'logs/server.log');
		return;
	};

	jwt.verify(req.token, KEY.getKey(), (err, authData) => {
		if (err) {
			res.status(403).json({
				"code": res.statusCode,
				"message": "Error append"
			});
		} else {
			db.run("INSERT INTO saves (user_id, save_json) VALUES (?,?)", [authData['user']['user_id'], data], (err) => {
				if (err) {
					res.status(500).json({
						"code": res.statusCode,
						"message": err
					});
					log('IP : ' + req.ip + ' - return code : ' + res.statusCode + ' - on url ' + req.url + ' - with method ' + req.method, 'logs/server.log');
					return;
				} else {
					res.json({
						"code" : res.statusCode,
						"message": req.statusMessage
					});
				}
			});
		}
	});
});

app.get('/classes', (req, res) => {
	db.all("SELECT * FROM classes", (err, classes) => {
		if (err) {
			res.status(500).json({
				"code": res.statusCode,
				"message": err
			});
		} else {
			res.json({
				"code" : res.statusCode,
				"message": req.statusMessage,
				classes
			});
		}
	});
});

app.get('/levels', (req,res) => {
	db.all("SELECT * FROM levels", (err, levels) => {
		if (err) {
			res.status(500).json({
				"code": res.statusCode,
				"message": err
			});
		} else {
			res.json({
				"code" : res.statusCode,
				"message": req.statusMessage,
				levels
			});
		}
	});
});

app.get('/monsters', (req, res) => {
	db.all("SELECT * FROM monsters", (err, monsters) => {
		if (err) {
			res.status(500).json({
				"code": res.statusCode,
				"message": err
			});
		} else {
			res.json({
				"code" : res.statusCode,
				"message": req.statusMessage,
				monsters
			});
		}
	});
});

app.listen(PORT, HOST, () => console.log('Running on http://172.18.1.1:8080'));

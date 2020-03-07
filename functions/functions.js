function updateTimeLog(db, uid) {
    db.exec("UPDATE users SET user_last_log = datetime('now') WHERE user_id = " + uid);
};

function updateLastLogIp(db, uid, ip) {
    db.exec("UPDATE users SET user_last_ip = '"+ ip +"' WHERE user_id = " + uid);
};

function validateToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if (typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.status(403).json({
            "code": res.statusCode,
            "message": "Token error"
        });
    }
};


module.exports = {
    updateTimeLog : updateTimeLog,
    validateToken : validateToken,
    updateLastLogIp : updateLastLogIp
};
function updateTimeLog(db, uid) {
    db.exec("UPDATE users SET user_last_log = datetime('now') WHERE user_id = " + uid);
};


module.exports = {
    updateTimeLog : updateTimeLog
};
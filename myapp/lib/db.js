let mysql = require('mysql')
const dbSettingData = require('./privateData/dbSettingData')

var db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: dbSettingData.password,
    database: dbSettingData.database,
})
db.connect();

module.exports = db;
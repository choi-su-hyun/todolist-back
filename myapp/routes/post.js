var express = require('express');
var router = express.Router();
var db = require('../lib/db');

// todo 리스트 전달 api
router.get('/', function(req, res){
    db.query(`SELECT * FROM content_list WHERE author_id=?`, [req.user.id], function(err, rows){
        if(err) {
            res.status(500).json({
                message: 'DB_ERROR'
            })
        }
        res.status(200).json({
            message: 'success',
            contents: rows,
        })
    })
})

module.exports = router;
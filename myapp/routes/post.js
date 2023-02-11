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

// create api
router.post('/create-process', function(req, res) {
    const post = req.body;
    console.log(post)
    db.query(`INSERT INTO content_list(title, paragraph, created, author_id) VALUES(?, ?, now(), ?)`,[post.todoTitle, post.todoDetail, req.user.id], function(err, result){
        if(err) {
            res.status(500).json({
                message: 'DB_ERROR'
            })
        }
        res.send('CREATE_SUCCESS')
    })
})

// delete api
router.delete('/delete/:id', function(req, res) {
    const willDeletePost = req.params.id
    db.query(`DELETE FROM content_list WHERE id=?`,[willDeletePost], function(err, result) {
        if(err) {
            res.status(500).json({
                message: 'DB_ERROR'
            })
        }
        res.send('DELETE_SUCCESS');
    })
})

// update를 위한 해당 글 내용 가져오기 api
router.get('/edit/:id', function(req, res) {
    db.query(`SELECT title, paragraph FROM content_list WHERE id=?`,[req.params.id], function(err, row) {
        if(err) {
            res.status(500).json({
                message: 'DB_ERROR'
            })
        }
        res.status(200).json({
            message: 'BEFORE_UPDATE_DATA_SUCCESS',
            updateData: row[0],
        })
    })
})

// update api
router.put('/edit/:id/update_process', function(req, res) {
    const post = req.body
    db.query(`UPDATE content_list SET title=?, paragraph=? WHERE id=?`,[post.todoTitle, post.todoDetail, req.params.id], function(err, row) {
        if(err) {
            res.status(500).json({
                message: 'DB_ERROR'
            })
        }
        res.status(200).json({
            message: 'UPDATE_SUCCESS',
        })
    })
})

module.exports = router;
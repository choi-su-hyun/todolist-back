var express = require('express');
var router = express.Router();
var db = require('../lib/db');
var bcrypt = require('bcrypt');
var newToken = require('../util/token')

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

// 아이디 중북 체크 api
router.post('/id-check-process', function(req, res) {
  const post = req.body;
  console.log(post)
  try {
    if(post.checkingId.length < 8) {
      db.query(`SELECT * FROM user WHERE user_id=?`,[post.checkingId], (err, row) => {
        console.log(row[0]);
          if(row[0]) {
            res.status(404).json({message:'EXIST_ID'});
          } else {
            res.send('CAN_USE')
          }
      })
    } else {
      res.status(404).json({message:'TOO_LONG_ID'});
    }
  } catch (error) {
    res.status(500).json({
      message: 'SOMETHING_ERROR',
      error
    })
  }
});

// 회원가입 api
router.post('/signup-process', async function(req, res) {
  const post = req.body 
  try {
    await bcrypt.hash(post.password, 10, (err, encryptedPW) => {
      db.query(`INSERT INTO user(user_id, user_password, user_name, user_email) VALUES(?, ?, ?, ?)`,[post.user_id, encryptedPW, post.name, post.email], function(err2, result) {
        if(err2) {
          console.log(err2);
          res.status(500).json({message:'FAILED_MYSQL_INSERT', err2})
        }
        res.status(200).json({message:'SUCCESS_SIGNUP'})
      })
    })
  } catch (error) {
    res.status(500).json({message:'FAILED_ENCRYPT', error})
  }
  
})

// 로그인 api
router.post('/login-process', function(req, res) {
  const post = req.body;
  try {
    db.query(`SELECT * FROM user WHERE user_id=?`,[post.user_id], async function(err, row){
      if(err) {
        res.status(500).json({
          message: 'DB_ERROR',
          err
        })
      }
      if(row[0] === undefined) {
        return res.status(404).json({
          message: 'ID_NOTHING',
          err
        })
      }
      await bcrypt.compare(post.password, row[0].user_password, function(err2, match) {
        if(err2) {
          res.status(500).json({
            message: 'DECRYPTION_ERROR',
            err2
          })
        }
        if(match) {
          const userData = {
            userIdx: row[0].id,
            nickName: row[0].user_name,
          }
          const token = newToken.sign(userData).token;
          console.log('토큰 확인',token);
          res.status(200).json({
            message: 'THIS_USER_CERTIFICATED',
            nickName: row[0].user_name,
            token: token,
          })
        } else {
          res.status(401).json({
            message: 'PASSWORD_NOT_MATCHED',
          })
        }
      })
    })
  } catch (error) {
    res.status(500).json({
      message: 'SOMETHING_ERROR',
      error,
    })
  }
})
module.exports = router;

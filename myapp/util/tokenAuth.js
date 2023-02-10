const tokenTool = require('./token')
const db = require('../lib/db')

module.exports = async function tokenAuthCheck(req, res, next) {
    if(!req.headers.authorization) {
        return res.status(401).json({
            message: 'TOKEN_IS_NOT_INCLUDED',
          })
    }

    const token = req.headers.authorization;
    let payload = ''
    try {
        payload = await tokenTool.verify(token);
    } catch (error) {
        console.log(error)
        return res.status(401).json({
                message: 'TOKEN_IS_INVALID',
                error
              })
    }
    db.query(`SELECT * FROM user WHERE id=?`,[payload.idx], function(err, row) {
        if(err) {
            res.status(500).json({
                message: 'DB_ERROR',
                err
              })
        }
        console.log('row 확인', row)
        if(row[0] === undefined) {
            res.status(500).json({
                message: 'USER_IS_NOT_FOUND',
              })
        } 
        req.user = row[0]
        console.log('req.user내용',req.user.id)
        next();
    })

}

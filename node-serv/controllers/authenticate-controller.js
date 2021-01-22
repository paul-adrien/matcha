var connection = require('./../config/db');
const bcrypt = require('bcrypt');
const config = require('../config/jwt.json');
const jwt = require('jsonwebtoken');

exports.authenticate = (req,res) => {
    var userName = req.body.userName;
    var password = req.body.password;
   
   
    connection.query('SELECT * FROM users WHERE userName = ?',[userName], function (error, results, fields) {
        if (error) {
            res.json({
                status:false,
                message:'there are some error with query'
            })
        } else {
        if(results.length > 0){
            bcrypt.compare(password, results[0]['password'], function(err, result) {
                if(result == true){
                    if (results[0]['emailVerify'] != 0)
                    {
                        const token = jwt.sign({ id: results[0]['id'] }, config.secret, { expiresIn: '1d' });
                        res.json({
                            status: true,
                            message:'successfully authenticated',
                            user: results[0],
                            token: token
                        })
                    } else {
                        res.json({
                            status:false,
                            message:"your adress mail is not validated, check your mail to validate him",
                            user: results[0]
                        });
                    }
                } else {
                    res.json({
                    status:false,
                    message:"userName and password does not match password: "+password+" hash: "+results[0]['password']+" userName: "+userName+""
                    });
                }
            });
        }
        else{
          res.json({
              status:false,    
            message:"UserName does not exits"
          });
        }
      }
    });
}


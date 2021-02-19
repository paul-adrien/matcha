var connection = require('./../config/db');
const bcrypt = require('bcrypt');
const config = require('../config/jwt.json');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
var nodemailer = require('nodemailer');
 
exports.register = (req,res) => {

  connection.query('SELECT * FROM users WHERE userName = ?',[req.body.userName], function (error, results, fields) {
    if (error) {
        res.json({
            status:false,
            message:'there are some error with query select username'
        })
    } else {
      if(results.length > 0){
        res.json({
          status:false,
          message:'this username already exist'
        })
      } else {
        connection.query('SELECT * FROM users WHERE email = ?',[req.body.email], function (error, results, fields) {
          if (error) {
              res.json({
                  status:false,
                  message:'there are some error with query select email'
              })
          } else {
          if(results.length > 0){
            res.json({
              status:false,
              message:'this email already exist'
          })
          } else {
            bcrypt.genSalt(saltRounds, function(err, salt) {
              bcrypt.hash(req.body.password, salt, function(err, hash) {
                var rand = Math.floor((Math.random() * 100) + 54);
                connection.query('INSERT INTO users (email, password, userName, lastName, firstName, emailVerify, profileComplete, link, nbLikes) VALUES (?, ?, ?, ?, ?, 0, 0, ?, 0)',[req.body.email, hash, req.body.userName, req.body.lastName, req.body.firstName, rand], function (error, results, fields) {
                  if (error) {
                    res.json({
                        status:false,
                        message:'there are some error with query insert new user',
                        error: error,
                        user: req.body
                    })
                  }else {
                    connection.query('SELECT * FROM users WHERE userName = ?',[req.body.userName], function (error, results, fields) {

                      var link = "http://localhost:8081/verify/"+rand;
                      var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                          user: '42.noreplymatcha@gmail.com',
                          pass: 'GguyotPlaurent76'
                        }
                      });
                      
                      var mailOptions = {
                        from: '42.noreplymatcha@gmail.com',
                        to: 'gabin.guyot17@gmail.com',
                        subject: 'Please confirm your Email account',
                        html: 'Hello,<br> Please Click on the link to verify your email.<br><a href='+link+'>Click here to verify</a>'
                      };
                      
                      transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                          console.log(error);
                        } else {
                          console.log('Email sent: ' + info.response);
                        }
                      });
                      
                      res.json({
                        status:true,
                        user: results[0],
                        message:'user registered sucessfully'
                      })
                    })
                  }
                });
              });
            });
          }
        }
        });
      }
    }
  });
}

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

exports.verifyEmail = (req,res) => {
    var email = req.body.email;
    var id = req.body.id;
   
   
    connection.query('SELECT link FROM users WHERE email = ?',email, function (error, results, fields) {
        if (error) {
            res.json({
                status:false,
                message:'there are some error with query'
            })
        } else {
        if(results.length > 0){
            if (id == results[0]['link'])
            {
                connection.query('UPDATE users SET emailVerify = 1 WHERE email = ?',req.body.email, function (error, results, fields) {
                    if (error) {
                        res.json({
                            status:false,
                            message:'there are some error with query update'
                        })
                    } else {
                        res.json({
                        status:true,
                        message:'successfully validating email'
                        })
                    }
                });
            }
        }
        else{
          res.json({
              status:false,    
            message:"Email does not exits"
          });
        }
      }
    });
}

exports.forgotPass_send = (req,res) => {
    var email = req.body.email;

    connection.query('SELECT * FROM users WHERE email = ?',email, function (error, results, fields) {
        if (error) {
            res.json({
                status:false,
                message:'there are some error with query'
            })
        } else {
            if(results.length > 0){
                var rand = Math.floor((Math.random() * 100) + 54);
                var link = "http://localhost:8081/forgotPass/"+rand;
                var transporter = nodemailer.createTransport({
                    service: 'gmail',
                    auth: {
                    user: '42.noreplymatcha@gmail.com',
                    pass: 'GguyotPlaurent76'
                    }
                });
                
                var mailOptions = {
                        from: '42.noreplymatcha@gmail.com',
                        to: 'gabin.guyot17@gmail.com',
                        subject: 'Please confirm your Email account',
                        html: 'Hello,<br> Please Click on the link to verify your email.<br><a href='+link+'>Click here to verify</a>'
                };
                
                transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                        console.log(error);
                        } else {
                        console.log('Email sent: ' + info.response);
                        }
                })
                connection.query('UPDATE users SET link = ? WHERE email = ?',[rand, req.body.email], function (error, results, fields) {
                    if (error) {
                        res.json({
                            status:false,
                            message:'there are some error with query update'
                        })
                    } else {
                        res.json({
                        status:true,
                        message:'successfully sending email'
                        })
                    }
                });
            } else {
                res.json({
                    status:false,
                    message:'Username does not exits'
                })
            }
        }
    });
}

exports.forgotPass_change = (req,res) => {
    var email = req.body.email;
    var password = req.body.password;
    var id = req.body.id;
   
    connection.query('SELECT * FROM users WHERE email = ?',email, function (error, results, fields) {
        if (error) {
            res.json({
                status:false,
                message:'there are some error with query'
            })
        } else {
        if(results.length > 0){
            if (id == results[0]['link'])
            {
                bcrypt.genSalt(saltRounds, function(err, salt) {
                    bcrypt.hash(password, salt, function(err, hash) {
                        connection.query('UPDATE users SET password = ? WHERE email = ?',[hash, email], function (error, results, fields) {
                            if (error) {
                                res.json({
                                    status:false,
                                    message:'there are some error with query update password'
                                })
                            }else{
                                res.json({
                                    status:true,
                                    data:results,
                                    message:'Password was changed'
                                })
                            }
                        });
                    });
                });
            }
            else {
                res.json({
                    status:false,
                    message:'wrong email'
                })
            }
        }
        else{
          res.json({
              status:false,    
            message:"Email does not exits"
          });
        }
      }
    });
}
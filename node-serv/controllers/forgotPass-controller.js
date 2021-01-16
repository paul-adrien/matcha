var connection = require('./../config/db');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var nodemailer = require('nodemailer');

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
                        to: 'paul.adrien.76@gmail.com',
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
    var mdp = req.body.mdp;
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
                    bcrypt.hash(mdp, salt, function(err, hash) {
                        connection.query('UPDATE users SET mdp = ? WHERE email = ?',[hash, email], function (error, results, fields) {
                            if (error) {
                                res.json({
                                    status:false,
                                    message:'there are some error with query update mdp'
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
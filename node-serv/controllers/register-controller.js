var connection = require('./../config/db');
const bcrypt = require('bcrypt');
const saltRounds = 10;
var nodemailer = require('nodemailer');
 
exports.register = (req,res) => {

  connection.query('SELECT * FROM users WHERE userName = ?',[req.body.username], function (error, results, fields) {
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
              bcrypt.hash(req.body.mdp, salt, function(err, hash) {
                var rand = Math.floor((Math.random() * 100) + 54);
                connection.query('INSERT INTO users (email, mdp, userName, nom, prenom, acc_valid, acc_comp, link) VALUES (?, ?, ?, ?, ?, 0, 0, ?)',[req.body.email, hash, req.body.username, req.body.name, req.body.prenom, rand], function (error, results, fields) {
                  if (error) {
                    res.json({
                        status:false,
                        message:'there are some error with query insert new user'
                    })
                  }else{
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
                    });
                    res.json({
                      status:true,
                      data:results,
                      message:'user registered sucessfully'
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

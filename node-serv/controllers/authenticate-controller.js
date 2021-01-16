var connection = require('./../config/db');
const bcrypt = require('bcrypt');

exports.authenticate = (req,res) => {
    var username = req.body.username;
    var mdp = req.body.mdp;
   
   
    connection.query('SELECT * FROM users WHERE userName = ?',[username], function (error, results, fields) {
        if (error) {
            res.json({
                status:false,
                message:'there are some error with query'
            })
        } else {
        if(results.length > 0){
            bcrypt.compare(mdp, results[0]['mdp'], function(err, result) {
                if(result == true){
                    if (results[0]['acc_valid'] != 0)
                    {
                        
                        res.json({
                            status:true,
                            message:'successfully authenticated'
                        })
                    } else {
                        res.json({
                            status:false,
                            message:"your adress mail is not validated, check your mail to validate him"
                        });
                    }
                } else {
                    res.json({
                    status:false,
                    message:"username and password does not match mdp: "+mdp+" hash: "+results[0]['mdp']+" username: "+username+""
                    });
                }
            });
        }
        else{
          res.json({
              status:false,    
            message:"Username does not exits"
          });
        }
      }
    });
}


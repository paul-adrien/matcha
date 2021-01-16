var connection = require('./../config/db');

exports.verify = (req,res) => {
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
                connection.query('UPDATE users SET acc_valid = 1 WHERE email = ?',req.body.email, function (error, results, fields) {
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


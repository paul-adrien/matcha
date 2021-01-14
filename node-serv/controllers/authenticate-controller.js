var connection = require('./../config/db');
exports.authenticate = (req,res) => {
    var email=req.body.email;
    var mdp=req.body.mdp;
   
   
    connection.query('SELECT mdp AS mdp FROM users WHERE email = ?',[email], function (error, results, fields) {
      if (error) {
          res.json({
            status:false,
            message:'there are some error with query'
            })
      }else{
       
        if(results){
            if(results[0] === mdp){
                res.json({
                    status:true,
                    message:'successfully authenticated'
                })
            }else{
                res.json({
                  status:false,
                  message:"Email and password does not match"
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

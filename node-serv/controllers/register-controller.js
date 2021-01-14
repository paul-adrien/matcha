var connection = require('./../config/db');
const bcrypt = require('bcrypt');
const saltRounds = 10;
 
exports.register = (req,res) => {
  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(req.body.mdp, salt, function(err, hash) {
      connection.query('INSERT INTO users (email, mdp, userName, nom, prenom) VALUES (?, ?, ?, ?, ?)',[req.body.email, hash, req.body.userName, req.body.name, req.body.prenom], function (error, results, fields) {
        if (error) {
          res.json({
              status:false,
              message:'there are some error with query'
          })
        }else{
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

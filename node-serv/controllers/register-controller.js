var connection = require('./../config/db');
 
exports.register = (req,res) => {
    connection.query('INSERT INTO users (email, mdp, userName, nom, prenom) VALUES (?, ?, ?, ?, ?)',[req.body.email, req.body.mdp, req.body.prenom, req.body.name, req.body.userName], function (error, results, fields) {
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
}

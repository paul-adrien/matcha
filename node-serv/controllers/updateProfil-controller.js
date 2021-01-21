var connection = require('./../config/db');
 
exports.updateProfil = (req,res) => {
    connection.query('UPDATE users SET nom = ?, prenom = ?, email = ?, userName = ?, genre = ?, bio = ? WHERE email = ?',[req.body.lastName, req.body.firstName, req.body.email, req.body.userName, req.body.genre, req.body.bio, req.body.saveEmail], function (error, results, fields) {
        if (error) {
            res.json({
                status:false,
                message:'there are some error with query update profil'
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
                            status:true,
                            message:'profil was update',
                            user: results[0]
                        });
                    } else {
                        res.json({
                            status:false,
                            message:'update failed'
                        });
                    }
                }
            });
        }
    });
}

var connection = require('./../config/db');
const config = require('../config/jwt.json');
const jwt = require('jsonwebtoken');

async function getUser(id) {
    return new Promise(resultat =>
        connection.query("SELECT * FROM users WHERE id = ?", [id], function (error, results, fields) {
            if (error) {
            resultat(null);
            } else {
                if (results && results.length > 0) {
                    resultat(results[0]);
                } else {
                    resultat(null);
                }
            }
        })
    );
}

exports.verifyToken = async (req,res) => {
    var token = req.body.token;
    var id = req.body.id;

    if (token !== undefined && id !== undefined && await getUser(id) != null) {
        jwt.verify(token, config.secret, (err, decoded) => {
            if (err) {
            res.json({
                    status:false,
                    message: "Unauthorized!"
            });
            }
            if (decoded['id'] === id) {
                res.json({
                    status:true,
                    message:'successfully validating token'
                })
            } else {
                res.json({
                    status:false,
                    message:'wrong token'
                })
            }
        });
    } else {
        res.json({
            status:false,
            message:'wrong data input'
        });
    }
}

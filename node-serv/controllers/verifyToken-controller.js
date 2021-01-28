var connection = require('./../config/db');
const config = require('../config/jwt.json');
const jwt = require('jsonwebtoken');

exports.verifyToken = (req,res) => {
    var token = req.body.token;
    var id = req.body.id;
    var vId = { id: id};

    jwt.verify(token, config.secret, (err, decoded) => {
        if (err) {
          res.status({
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
    
}

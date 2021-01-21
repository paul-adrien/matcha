var connection = require('./../config/db');
const config = require('../config/jwt.json');
const jwt = require('jsonwebtoken');

exports.verifyToken = (req,res) => {
    var token = req.body.token;
    var id = req.body.id;
    var vId = { id: id};

    vId = jwt.verify(token, config.secret)

    if (vId['id'] === id) {
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
}

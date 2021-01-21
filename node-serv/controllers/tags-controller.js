var connection = require('./../config/db');
 
exports.addTag = (req,res) => {

  connection.query('SELECT * FROM tag WHERE name = ?',[req.body.name], function (error, results, fields) {
    if (error) {
        res.json({
            status:false,
            message:'there are some error with query select name tag'
        })
    } else {
      if(results.length > 0){
        connection.query('INSERT INTO user_tag (tag_id, user_id) VALUES (?, ?)',[req.body.tag_id, req.body.user_id], function (error, results, fields) {
            if (error) {
                res.json({
                    status:false,
                    message:'there are some error with query select email'
                })
            } else {
                res.json({
                    status:true,
                    message:'tag add'
                })
            }
        });
      } else {
        connection.query('INSERT INTO tag (name) VALUES (?)',[req.body.name], function (error, results, fields) {
            if (error) {
                res.json({
                    status:false,
                    message:'there are some error with insert tag'
                })
            } else {
                connection.query('SELECT * FROM tag WHERE name = ?',[req.body.name], function (error, results, fields) {
                    if (error) {
                        res.json({
                            status:false,
                            message:'there are some error with query select name tag'
                        })
                    } else {
                        if (results[0].length > 0) {
                            connection.query('INSERT INTO user_tag (tag_id, user_id) VALUES (?, ?)',[results[0][id], req.body.user_id], function (error, results, fields) {
                                if (error) {
                                    res.json({
                                        status:false,
                                        message:'there are some error with query select email'
                                    })
                                } else {
                                    res.json({
                                        status:true,
                                        message:'tag add'
                                    })
                                }
                            });
                        } else {
                            res.json({
                                status:false,
                                message:'error insert tag'
                            })
                        }
                    }
                });
            }
        });
      }
    }
  });
}

exports.seeTag = (req,res) => {

    connection.query('SELECT * FROM user_tag WHERE user_id = ?',[req.body.user_id], function (error, results, fields) {
        if (error) {
            res.json({
                status:false,
                message:'there are some error with query select tag_id'
            })
        } else {
            if(results.length > 0){
                var i = 0;
                var tags;
                while (results[i]) {
                    connection.query('SELECT * FROM tag WHERE id = ?',[results[i]['tag_id']], function (error, results, fields) {
                        if (error) {
                            res.json({
                                status:false,
                                message:'there are some error with query select email'
                            })
                        } else {
                            if(results.length > 0){
                                tags[i] = results[0]['name'];
                            }
                            else {
                                res.json({
                                    status:false,
                                    message:'there are some error with query select tag name'
                                })
                            }
                        }
                    });
                }
                res.json({
                    status:true,
                    message:'select tags names',
                    tags_name: tags
                });
            } else {
                res.json({
                    status:true,
                    message:'no tag find',
                    tags_name: null
                });
            }
        }
    });
  }
  
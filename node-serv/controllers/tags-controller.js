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
        connection.query('SELECT * FROM user_tag WHERE user_id = ? AND tag_id = ?',[req.body.user_id, results[0]['tag_id']], function (error, result, fields) {
          if (error) {
              res.json({
                  status:false,
                  message:'there are some error with query select tag'
              })
          } else {
            if (result.length == 0) {
              connection.query('INSERT INTO user_tag (tag_id, user_id) VALUES (?, ?)',[results[0]['tag_id'], req.body.user_id], function (error, results, fields) {
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
                message:'this tags already exist'
            })
            }
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
                message:'there are some error with query select tag_id',
                tags_names: null
            })
        } else {
            if(results.length > 0){
                var i = 0;
                var tags;
                test = results;
                while (test && test[i]) {
                  connection.query('SELECT * FROM tag WHERE id = ?',[test[i]['tag_id']], function (error, results, fields) {
                      if (error) {
                          res.json({
                              status:false,
                              message:'there are some error with query select email',
                              tags_names: null
                          })
                      } else {
                          if(results.length > 0){
                              tags[i++] = results[0]['name'];
                          }
                          else {
                            test = null;
                              res.json({
                                  status:false,
                                  message:'there are some error with query select tag name',
                                  tags_names: null
                              });
                          }
                      }
                  });
                }
                res.json({
                    status:true,
                    message:'select tags names',
                    tags_names: tags
                });
            } else {
                res.json({
                    status:true,
                    message:'no tag find',
                    tags_names: null
                });
            }
        }
    });
  }
  
var connection = require('./../config/db');

exports.possiblyConv = (req,res) => {
  id = req.body.id;

  main();

  async function getUser(id) {
    return new Promise( resultat => 
        connection.query('SELECT * FROM users WHERE id = ?',[id], function (error, results, fields) {
            if (error) {
                resultat(null);
            } else {
                if (results && results.length > 0) {
                    resultat(results);
                }
                else{
                    resultat(null);
                }
            }
        })
    )
};

  async function getConv() {
    return new Promise( resultat => 
        connection.query('SELECT * FROM matched WHERE active = 0 AND (user_id1 = ? OR user_id2 = ?)',[id, id], function (error, results, fields) {
            if (error) {
                resultat(null);
            } else {
                if (results && results.length > 0) {
                    resultat(results);
                }
                else{
                    resultat(null);
                }
            }
        })
      )
  };

  async function main() {
    if ((matchs = await getConv()) !== null) {
      users = await Promise.all(matchs.map(async function(match) {
        if (match.user_id1 === id)
          user = getUser(match.user_id2);
        else
          user = getUser(match.user_id1);
        if (user !== null)
          return user;
      }));
      res.json({
        status:true,
        message:'get possibly conv',
        users: users
      });
    } else {
      res.json({
        status:true,
        message:'no possibly conv',
        users: null
      });
    }
  };
}

exports.activeConv = (req,res) => {
  id = req.body.id;
  ids = [];

  main();

  async function getConv() {
    return new Promise( resultat => 
        connection.query('SELECT * FROM matched WHERE active = 1 AND (user_id1 = ? OR user_id2 = ?)',[id], function (error, results, fields) {
            if (error) {
                resultat(null);
            } else {
                if (results && results.length > 0) {
                    resultat(results);
                }
                else{
                    resultat(null);
                }
            }
        })
      )
  };

  async function getLastMsg(id_conv) {
    return new Promise( resultat => 
        connection.query('SELECT * FROM message WHERE conv_id = ? ORDER BY ID DESC LIMIT 1',[id_conv], function (error, results, fields) {
            if (error) {
                resultat(null);
            } else {
                if (results && results.length > 0) {
                    resultat(results);
                }
                else{
                    resultat(null);
                }
            }
        })
      )
  };

  async function main() {
    if ((convs = await getConv()) !== null) {
      convs = await Promise.all(convs.map(async function(conv) {
        msg = await getLastMsg(user.id)
        if (user.user_id1 === id)
          return {...conv, other_id: user.user_id2, msg: msg};
        else
          return {...conv, other_id: user.user_id1, msg: msg};
      }));
      res.json({
        status:true,
        message:'get possibly conv',
        convs: convs
      });
    } else {
      res.json({
        status:true,
        message:'no possibly conv',
        convs: null
      });
    }
  };
}

exports.getMessage = (req,res) => {
  conv_id = req.body.conv_id;

  main();

  async function getMsg() {
    return new Promise( resultat => 
        connection.query('SELECT * FROM message WHERE conv_id = ?',[conv_id], function (error, results, fields) {
            if (error) {
                resultat(null);
            } else {
                if (results && results.length > 0) {
                    resultat(results);
                }
                else{
                    resultat(null);
                }
            }
        })
      )
  };

  async function updtSeeMsg() {
    return new Promise( resultat => 
        connection.query('UPDATE message SET see = see+1 WHERE conv_id = ? AND see = 0',[conv_id], function (error, results, fields) {
            if (error) {
              resultat(null);
            } else {
              resultat(1);
            }
        })
      )
  };

  async function main() {
    if ((messages = await getMsg()) !== null) {
      if ((await updtSeeMsg()) !== null) {
        res.json({
          status:true,
          message:'get messages',
          messages: messages
        });
      } else {
        res.json({
          status:false,
          message:'error when update mesage see',
          messages: messages
        });
      }
      
    } else {
      res.json({
        status:true,
        message:'0 msg',
        convs: null
      });
    }
  };
}

exports.sendMessage = (req,res) => {
  conv_id = req.body.conv_id;
  msg = req.body.msg;
  sender_id = req.body.conv_id;

  main();

  async function insMsg() {
    return new Promise( resultat => 
        connection.query('INSERT INTO message (conv_id, msg, sender_id, sendingDate) VALUES (?, ?, ?, DATE(NOW()))',[conv_id, msg, sender_id], function (error, results, fields) {
            if (error) {
                resultat(null);
            } else {
              resultat(1);
            }
        })
      )
  };

  async function updtActiveConv() {
    return new Promise( resultat => 
        connection.query('UPDATE matched SET active = active+1 WHERE conv_id = ? AND active = 0',[conv_id], function (error, results, fields) {
            if (error) {
              resultat(null);
            } else {
              resultat(1);
            }
        })
      )
  };

  async function main() {
    if ((messages = await insMsg()) !== null) {
      if (updtActiveConv() !== null)
      {
        res.json({
          status:true,
          message:'get messages'
        });
      } else {
        res.json({
          status:false,
          message:'error update active conv'
        });
      }
    } else {
      res.json({
        status:false,
        message:'error insert message'
      });
    }
  };
}
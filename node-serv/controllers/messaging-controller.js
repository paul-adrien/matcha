var connection = require("./../config/db");

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

exports.possiblyConv = (req, res) => {
  id = req.params.id;

  main();

  async function getConv() {
    return new Promise(resultat =>
      connection.query(
        "SELECT * FROM matched WHERE active = 0 AND (user_id1 = ? OR user_id2 = ?)",
        [id, id],
        function (error, results, fields) {
          if (error) {
            resultat(null);
          } else {
            if (results && results.length > 0) {
              console.log(results);
              resultat(results);
            } else {
              resultat(null);
            }
          }
        }
      )
    );
  }

  async function main() {
    if ((matchs = await getConv()) !== null) {
      users = await Promise.all(
        matchs.map(async function (match) {
          if (match.user_id1 === id) user = await getUser(match.user_id2);
          else user = await getUser(match.user_id1);
          if (user !== null) return { user: user, convId: match["id"] };
          else return { user: null, convId: match["id"] };
        })
      );
      res.json(users.filter(user => user?.user !== null));
    } else {
      res.json([]);
    }
  }
};

exports.activeConv = (req, res) => {
  id = req.params.id;
  ids = [];

  main();

  async function getConv() {
    return new Promise(resultat =>
      connection.query(
        "SELECT * FROM matched WHERE active = 1 AND (user_id1 = ? OR user_id2 = ?)",
        [id, id],
        function (error, results, fields) {
          if (error) {
            resultat(null);
          } else {
            if (results && results.length > 0) {
              resultat(results);
            } else {
              resultat([]);
            }
          }
        }
      )
    );
  }

  async function getLastMsg(id_conv) {
    return new Promise(resultat =>
      connection.query(
        "SELECT * FROM message WHERE conv_id = ? ORDER BY ID DESC LIMIT 1",
        [id_conv],
        function (error, results, fields) {
          if (error) {
            resultat(null);
          } else {
            if (results && results.length > 0) {
              resultat(results[0].msg);
            } else {
              resultat(null);
            }
          }
        }
      )
    );
  }

  async function main() {
    if ((convs = await getConv()) !== null) {
      convs = await Promise.all(
        convs?.map(async function (conv) {
          msg = await getLastMsg(conv.id);
          if (conv.user_id1 === id) {
            let otherUser = await getUser(conv.user_id2);
            return { ...conv, otherUser: otherUser, lastMsg: msg };
          } else {
            let otherUser = await getUser(conv.user_id1);
            return { ...conv, otherUser: otherUser, lastMsg: msg };
          }
        })
      );
      res.json(convs.filter(conv => conv.otherUser !== null));
    } else {
      res.json([]);
    }
  }
};

exports.getMessage = (req, res) => {
  conv_id = req.params.id;

  main();

  async function getMsg() {
    return new Promise(resultat =>
      connection.query(
        "SELECT * FROM message WHERE conv_id = ?",
        [conv_id],
        function (error, results, fields) {
          if (error) {
            resultat(null);
          } else {
            if (results && results.length > 0) {
              resultat(results);
            } else {
              resultat(null);
            }
          }
        }
      )
    );
  }

  async function updtSeeMsg() {
    return new Promise(resultat =>
      connection.query(
        "UPDATE message SET see = see+1 WHERE conv_id = ? AND see = 0",
        [conv_id],
        function (error, results, fields) {
          if (error) {
            resultat(null);
          } else {
            resultat(1);
          }
        }
      )
    );
  }

  async function main() {
    if ((messages = await getMsg()) !== null) {
      if ((await updtSeeMsg()) !== null) {
        res.json({
          status: true,
          message: "get message",
          messages: messages,
        });
      } else {
        res.json({
          status: false,
          message: "error when update mesage see",
          messages: null,
        });
      }
    } else {
      res.json({
        status: true,
        message: "0 msg",
        messages: null,
      });
    }
  }
};

exports.seeMsgNotif = (req, res) => {
  other_id = req.body.other_id;
  user_id = req.body.user_id;

  connection.query(
    'UPDATE notif SET see = 1 WHERE type = "msg" AND userId = ? AND sender_id = ?',
    [user_id, other_id],
    function (error, results, fields) {
      if (error) {
        res.json({
          status: false,
          message: "error update msg",
        });
      } else {
        res.json({
          status: true,
          message: "update msg notif",
        });
      }
    }
  );
};

exports.sendMessage = (req, res) => {
  conv_id = req.body.conv_id;
  msg = req.body.msg;
  sender_id = req.body.sender_id;
  user_id = req.body.user_id;
  let date = new Date();

  main();

  function notifMsg() {
    console.log("notif msg", user_id, sender_id);
    connection.query(
      'SELECT * FROM notif WHERE userId = ? AND sender_id = ? AND type = "msg"',
      [user_id, sender_id],
      function (error, results, fields) {
        if (error) {
          return null;
        } else {
          if (results && results.length > 0) {
            console.log(results[0]);
            connection.query(
              'UPDATE notif SET date = ?, see = 0 WHERE userId = ? AND sender_id = ? AND type = "msg"',
              [date.toString(), user_id, sender_id],
              function (error, results, fields) {
                if (error) {
                  return null;
                } else {
                  return 1;
                }
              }
            );
          } else {
            connection.query(
              'INSERT INTO notif (userId, sender_id, type, date) VALUES (?, ?, "msg", ?)',
              [user_id, sender_id, date.toString()],
              function (error, results, fields) {
                if (error) {
                  return null;
                } else {
                  return 1;
                }
              }
            );
          }
        }
      }
    );
  }

  async function insMsg() {
    return new Promise(resultat =>
      connection.query(
        "INSERT INTO message (conv_id, msg, sender_id, sendingDate) VALUES (?, ?, ?, DATE(NOW()))",
        [conv_id, msg, sender_id],
        function (error, results, fields) {
          if (error) {
            resultat(null);
          } else {
            resultat(1);
          }
        }
      )
    );
  }

  async function updtActiveConv() {
    return new Promise(resultat =>
      connection.query(
        "UPDATE matched SET active = active+1 WHERE id = ? AND active = 0",
        [conv_id],
        function (error, results, fields) {
          if (error) {
            resultat(null);
          } else {
            resultat(1);
          }
        }
      )
    );
  }

  async function checkIfBlocked() {
    return new Promise(resultat =>
      connection.query(
        "SELECT * FROM blocked WHERE userId = ? AND blockedId = ?",
        [user_id, sender_id],
        function (error, results, fields) {
          if (error) {
            resultat(null);
          } else {
            if (results && results.length > 0) {
              resultat(1);
            } else {
              resultat(null);
            }
          }
        }
      )
    );
  }

  async function main() {
    if ((messages = await insMsg()) !== null) {
      if ((await updtActiveConv()) !== null) {
        if ((await checkIfBlocked()) === null) notifMsg();
        res.json({
          status: true,
          message: "send messages",
        });
      } else {
        res.json({
          status: false,
          message: "error send message",
        });
      }
    } else {
      res.json({
        status: false,
        message: "error insert message",
      });
    }
  }
};

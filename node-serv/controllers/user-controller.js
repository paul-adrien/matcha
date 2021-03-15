var connection = require("./../config/db");
var forEach = require("async-foreach").forEach;
const https = require("https");
var request = require("request");
var datefns = require("date-fns");

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

exports.getHistory = (req, res) => {
  var resultat = [];
  var userId = req.params.id;

  takeAllUsers(resultat);

  async function getUsersIdView() {
    return new Promise(resultat =>
      connection.query(
        "SELECT * FROM users_views WHERE viewed_id = ?",
        [userId],
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

  async function getUsersIdLike() {
    return new Promise(resultat =>
      connection.query(
        "SELECT * FROM users_like WHERE liked_id = ?",
        [userId],
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

  async function takeAllUsers(resultat) {
    if (userId) {
      let usersIdView = await getUsersIdView();
      let usersView =
        usersIdView &&
        (await Promise.all(
          usersIdView.map(async userView => {
            let tmp = await getUser(userView.views_id);
            if (tmp) {
              return { user: tmp, date: new Date(userView.viewDate), type: "view" };
            } else {
              return { user: undefined, date: new Date(userView.viewDate), type: "view" };
            }
          })
        ));
      let usersIdLike = await getUsersIdLike();
      let usersLike =
        usersIdLike &&
        (await Promise.all(
          usersIdLike.map(async userLike => {
            let tmp = await getUser(userLike.like_id);
            if (tmp) {
              return { user: tmp, date: new Date(userLike.likeDate), type: "like" };
            } else {
              return { user: undefined, date: new Date(userLike.likeDate), type: "like" };
            }
          })
        ));
      let usersHistory =
        usersView?.concat(usersLike).filter(userHistory => userHistory?.user !== undefined) || [];

      if (usersHistory !== null) {
        res.json(
          usersHistory?.sort((a, b) => {
            if (datefns.isBefore(new Date(a.date), new Date(b.date))) {
              return 1;
            } else if (datefns.isBefore(new Date(b.date), new Date(a.date))) {
              return -1;
            }
          })
        );
      } else {
        res.json({
          status: false,
          message: "pas d'historique",
          users: null,
        });
      }
    } else {
      res.json({
        status: true,
        message: "error with data received",
      });
    }
  }
};

exports.viewedProfil = (req, res) => {
  var user_id = req.params.id;
  var viewed_id = req.body.viewed_id;

  let date = new Date();

  main();

  async function checkIfBlocked() {
    return new Promise(resultat =>
      connection.query(
        "SELECT * FROM blocked WHERE userId = ? AND blockedId = ?",
        [viewed_id, user_id],
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

  async function checkView() {
    return new Promise(resultat =>
      connection.query(
        "SELECT * FROM users_views WHERE viewed_id = ? AND views_id = ?",
        [viewed_id, user_id],
        function (error, results, fields) {
          if (error) {
            resultat(null);
          } else {
            if (results && results.length > 0) {
              connection.query(
                "UPDATE users_views SET viewDate = ? WHERE viewed_id = ? AND views_id = ?",
                [date.toString(), viewed_id, user_id],
                function (error, results, fields) {
                  if (error) {
                    resultat(null);
                  } else {
                    resultat(1);
                  }
                }
              );
              resultat(1);
            } else {
              resultat(null);
            }
          }
        }
      )
    );
  }

  async function addView() {
    return new Promise(resultat =>
      connection.query(
        "INSERT INTO users_views (viewed_id, views_id, viewDate) VALUES (?, ?, ?)",
        [viewed_id, user_id, date.toString()],
        function (error, results, fields) {
          if (error) {
            resultat(null);
          } else {
            connection.query(
              "UPDATE users SET nbViews = nbViews+1 WHERE id = ?",
              [viewed_id],
              function (error, results, fields) {
                if (error) {
                  resultat(null);
                } else {
                  resultat(1);
                }
              }
            );
          }
        }
      )
    );
  }

  function notifView() {
    connection.query(
      'SELECT * FROM notif WHERE userId = ? AND sender_id = ? AND type = "view"',
      [viewed_id, user_id],
      function (error, results, fields) {
        if (error) {
          return null;
        } else {
          if (results && results.length > 0) {
            connection.query(
              'UPDATE notif SET date = ?, see = 0 WHERE userId = ? AND sender_id = ? AND type = "view"',
              [date.toString(), viewed_id, user_id],
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
              'INSERT INTO notif (userId, sender_id, type, date) VALUES (?, ?, "view", ?)',
              [viewed_id, user_id, date.toString()],
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

  async function main() {
    if (user_id && viewed_id) {
      if ((await checkIfBlocked()) === null) notifView();
      if ((await checkView()) === null) {
        if (await addView()) {
          console.log("test");
          res.json({
            status: true,
            message: "profile view",
          });
        }
      } else {
        res.json({
          status: true,
          message: "profile already view",
        });
      }
    } else {
      res.json({
        status: true,
        message: "error with data received",
      });
    }
  }
};

exports.getUser = (req, res) => {
  var id = req.params.id;

  if (id) {
    connection.query("SELECT * FROM users WHERE id = ?", [id], function (error, results, fields) {
      if (error) {
        res.json({
          status: false,
          message: "there are some error with query select user",
          user: null,
        });
      } else {
        if (results.length > 0) {
          res.json(results[0]);
        } else {
          res.json({
            status: false,
            message: "User does not exist",
            user: null,
          });
        }
      }
    });
  } else {
    res.json({
      status: true,
      message: "error with data received",
    });
  }
};

exports.updatePosition = async (req, res) => {
  var id = req.params.id;
  let lat = req.body.latitude;
  let long = req.body.longitude;
  let currentPosition = req.body.currentPosition;

  if (id) {
    if (lat === undefined || long === undefined) {
      request(
        {
          url: "https://geolocation-db.com/json",
          json: true,
        },
        function (error, response, body) {
          if (!error && response.statusCode === 200) {
            lat = body.latitude;
            long = body.longitude;

            console.log(body);

            connection.query(
              "UPDATE users SET latitude = ?, longitude = ?, currentPosition = ? WHERE id = ?",
              [lat, long, currentPosition, id],
              function (error, results, fields) {
                if (error) {
                  res.json({
                    status: false,
                    message: "there are some error with query update user position",
                    user: null,
                  });
                } else {
                  res.json(`Position update ! ${lat} ${long}`);
                }
              }
            );
          }
        }
      );
    } else {
      console.log(id);

      connection.query(
        "UPDATE users SET latitude = ?, longitude = ?, currentPosition = ? WHERE id = ?",
        [lat, long, currentPosition, id],
        function (error, results, fields) {
          if (error) {
            res.json({
              status: false,
              message: "there are some error with query update user position",
              user: null,
            });
          } else {
            res.json(`Position update ! ${lat} ${long}`);
          }
        }
      );
    }
  } else {
    res.json({
      status: true,
      message: "error with data received",
    });
  }
};

exports.getNotifs = (req, res) => {
  id = req.params.id;

  main();

  async function getNotifs() {
    return new Promise(resultat => {
      connection.query(
        "SELECT * FROM notif WHERE userId = ?",
        [id],
        function (error, results, fields) {
          if (error) {
            resultat(null);
          } else {
            if (results && results.length > 0) resultat(results);
            else resultat(null);
          }
        }
      );
    });
  }

  async function main() {
    if (id) {
      let notifs = await getNotifs();
      let nbUnView = 0;

      notifs =
        notifs &&
        (await Promise.all(
          notifs.map(async function (notif) {
            let otherUser = await getUser(notif.sender_id);
            if (otherUser?.userName) {
              notif.otherUserName = otherUser.userName;
            }
            if (notif["see"] == 0) nbUnView++;
            return notif;
          })
        ));
      connection.query(
        "UPDATE users SET lastConnection = NOW() WHERE id = ?",
        [id],
        function (error, results, fields) {}
      );

      res.json({
        notifs: notifs?.sort((a, b) => {
          if (datefns.isBefore(new Date(a.date), new Date(b.date))) {
            return 1;
          } else if (datefns.isBefore(new Date(b.date), new Date(a.date))) {
            return -1;
          }
        }),
        nbUnView: nbUnView,
      });
    } else {
      res.json({
        status: true,
        message: "error with data received",
      });
    }
  }
};

exports.seeNotifs = (req, res) => {
  id = req.params.id;

  if (id) {
    connection.query(
      "UPDATE notif SET see = 1 WHERE userId = ?",
      [id],
      function (error, results, fields) {}
    );
  } else {
    res.json({
      status: true,
      message: "error with data received",
    });
  }
};

exports.delNotifs = (req, res) => {
  userId = req.params.userId;
  otherId = req.params.otherId;
  type = req.params.type;

  if (userId && otherId && type) {
    connection.query(
      "DELETE FROM notif WHERE userId = ? AND sender_id = ? AND type = ?",
      [userId, otherId, type],
      function (error, results, fields) {
        if (error) {
          res.json({
            status: false,
            message: "error when delete notifs",
          });
        } else {
          res.json(results);
        }
      }
    );
  } else {
    res.json({
      status: true,
      message: "error with data received",
    });
  }
};

exports.reportUser = (req, res) => {
  userId = req.body.userId;
  reportId = req.body.reportId;

  if (userId && reportId) {
    connection.query(
      "INSERT INTO report (userId, reportId) VALUES (?, ?)",
      [userId, reportId],
      function (error, results, fields) {
        if (error) {
          res.json(null);
        } else {
          res.status(200).send();
        }
      }
    );
  } else {
    res.json({
      status: true,
      message: "error with data received",
    });
  }
};

exports.blockUser = (req, res) => {
  userId = req.body.userId;
  blockedId = req.body.blockedId;

  if (userId && blockedId) {
    connection.query(
      "INSERT INTO blocked (userId, blockedId) VALUES (?, ?)",
      [userId, blockedId],
      function (error, results, fields) {
        if (error) {
          res.json(null);
        } else {
          res.status(200).send();
        }
      }
    );
  } else {
    res.json({
      status: true,
      message: "error with data received",
    });
  }
};

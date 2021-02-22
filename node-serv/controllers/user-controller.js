var connection = require("./../config/db");
var forEach = require("async-foreach").forEach;
const https = require("https");
var request = require("request");

exports.takeViewProfil = (req, res) => {
  var resultat = [];

  takeAllUsers(resultat);

  async function getUsersId() {
    return new Promise(resultat =>
      connection.query(
        "SELECT views_id FROM users_views WHERE viewed_id = ?",
        [req.body.user_id],
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

  async function getUserViews(id) {
    return new Promise(resultat =>
      connection.query("SELECT * FROM users WHERE id = ?", [id], function (error, results, fields) {
        if (error) {
          resultat(null);
        } else {
          resultat(results);
        }
      })
    );
  }

  async function funForEach(users) {
    var i = 0;
    return new Promise(resolve => {
      forEach(users, async function (user) {
        result = await getUserViews(user["views_id"]);
        if (result && result.length > 0) {
          if (!resultat || resultat.length === 0) resultat = [result[0]];
          else resultat.push(result[0]);
        }
        i++;
        if (i === users.length) {
          resolve(resultat);
        }
      });
    });
  }

  async function takeAllUsers(resultat) {
    users = await getUsersId();
    if (users !== null) {
      resultat = await funForEach(users);

      if (resultat !== null) {
        res.json({
          status: true,
          message: "views user",
          users: resultat,
        });
      }
    } else {
      res.json({
        status: false,
        message: "pas de vue2",
        users: null,
      });
    }
  }
};

exports.viewedProfil = (req, res) => {
  var user_id = req.params.id;
  var viewed_id = req.body.viewed_id;

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
        "INSERT INTO users_views (viewed_id, views_id) VALUES (?, ?)",
        [viewed_id, user_id],
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
      'SELECT * FROM notif WHERE userId = ? AND type = "view"',
      [viewed_id],
      function (error, results, fields) {
        if (error) {
          return null;
        } else {
          if (results && results.length > 0) {
            connection.query(
              'UPDATE notif SET date = DATE(NOW()), see = 0 WHERE userId = ? AND type = "view"',
              [viewed_id],
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
              'INSERT INTO notif (userId, otherId, type, date) VALUES (?, ?, "view", DATE(NOW()))',
              [viewed_id, user_id],
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
    if (checkIfBlocked() === null) notifView();
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
  }
};

exports.getUser = (req, res) => {
  var id = req.params.id;

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
};

exports.updatePosition = async (req, res) => {
  var id = req.params.id;
  let lat = req.body.latitude;
  let long = req.body.longitude;

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
            "UPDATE users SET latitude = ?, longitude = ? WHERE id = ?",
            [lat, long, id],
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
      "UPDATE users SET latitude = ?, longitude = ? WHERE id = ?",
      [lat, long, id],
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
    let notifs = await getNotifs();
    let nbUnView = 0;

    notifs =
      notifs &&
      (await Promise.all(
        notifs.map(async function (notif) {
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
      notifs: notifs,
      nbUnView: nbUnView,
    });
  }
};

exports.seeNotifs = (req, res) => {
  id = req.params.id;

  connection.query(
    "UPDATE notif SET see = 1 WHERE userId = ?",
    [id],
    function (error, results, fields) {}
  );
};

exports.delNotifs = (req, res) => {
  userId = req.params.userId;
  otherId = req.params.otherId;
  type = req.params.type;

  connection.query(
    "DELETE FROM notif WHERE userId = ? AND otherId = ? AND type = ?",
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
};

exports.reportUser = (req, res) => {
  userId = req.params.userId;
  reportId = req.params.reportId;

  connection.query(
    "INSERT INTO report (userId, reportId) VALUES (?, ?)",
    [userId, reportId],
    function (error, results, fields) {
      if (error) {
        res.json({
          status: false,
          message: "error when insert report",
        });
      } else {
        res.json(results);
      }
    }
  );
};

exports.blockUser = (req, res) => {
  userId = req.params.userId;
  blockedId = req.params.blockedId;

  connection.query(
    "INSERT INTO blocked (userId, reportId) VALUES (?, ?)",
    [userId, blockedId],
    function (error, results, fields) {
      if (error) {
        res.json({
          status: false,
          message: "error when insert blocked user",
        });
      } else {
        res.json(results);
      }
    }
  );
};

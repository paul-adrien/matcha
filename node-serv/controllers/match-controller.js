var connection = require("./../config/db");
var forEach = require("async-foreach").forEach;
var datefns = require("date-fns");

function oriSexPoint(user, otherUser) {
  if (
    user.gender == 1 &&
    (user.showMe == 1 || user.showMe == 3) &&
    otherUser.gender == 1 &&
    (otherUser.showMe == 1 || otherUser.showMe == 3)
  )
    return 5;
  else if (
    user.gender == 1 &&
    (user.showMe == 2 || user.showMe == 3) &&
    otherUser.gender == 2 &&
    (otherUser.showMe == 1 || otherUser.showMe == 3)
  )
    return 5;
  else if (
    user.gender == 2 &&
    (user.showMe == 1 || user.showMe == 3) &&
    otherUser.gender == 1 &&
    (otherUser.showMe == 2 || otherUser.showMe == 3)
  )
    return 5;
  else if (
    user.gender == 2 &&
    (user.showMe == 2 || user.showMe == 3) &&
    otherUser.gender == 2 &&
    (otherUser.showMe == 2 || otherUser.showMe == 3)
  )
    return 5;
  else return 0;
}

function locatPoint(user, otherUser) {
  lat1 = user.latitude;
  lat2 = otherUser.latitude;
  lon1 = user.longitude;
  lon2 = otherUser.longitude;
  if (lat1 == lat2 && lon1 == lon2) {
    dist = 0;
  } else {
    var radlat1 = (Math.PI * lat1) / 180;
    var radlat2 = (Math.PI * lat2) / 180;
    var theta = lon1 - lon2;
    var radtheta = (Math.PI * theta) / 180;
    var dist =
      Math.sin(radlat1) * Math.sin(radlat2) +
      Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
      dist = 1;
    }
    dist = Math.acos(dist);
    dist = (dist * 180) / Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344;
  }
  if (dist < 10) return 4;
  else if (dist < 50) return 3;
  else if (dist < 100) return 2;
  else if (dist < 200) return 1;
  else return 0;
}

function tagsMatchPoint(user, otherUser) {
  return new Promise(resultat =>
    connection.query(
      "SELECT tag_id FROM user_tag WHERE user_id = ? OR user_id = ?",
      [user.id, otherUser.id],
      function (error, results, fields) {
        r = -1;
        for (var i = 0; i < results.length - 1; i++) {
          for (var j = i + 1; j < results.length; j++) {
            if (results[i].tag_id == results[j].tag_id) {
              r++;
            }
          }
        }
        if (r > 5) r = 4;
        else if (r >= 3) r = 3;
        else if (r >= 2) r = 2;
        else if (r >= 1) r = 1;
        else r = 0;
        resultat(r);
      }
    )
  );
}

function scorePoint(user) {
  if (user.score == 0) return 0;
  else return user.score / 20;
}

async function checkIfMatch(user, otherUser) {
  return new Promise(resultat =>
    connection.query(
      "SELECT * FROM matched WHERE (user_id1 = ? AND user_id2 = ?) OR (user_id1 = ? AND user_id2 = ?)",
      [user, otherUser, otherUser, user],
      function (error, results, fields) {
        if (error) {
          resultat(null);
        } else {
          if (results && results.length > 0) {
            console.log("matched");
            resultat(1);
          } else {
            resultat(null);
          }
        }
      }
    )
  );
}

async function checkIfView(user, otherUser) {
  return new Promise(resultat =>
    connection.query(
      "SELECT * FROM users_views WHERE viewed_id = ? AND views_id = ?",
      [otherUser, user],
      function (error, results, fields) {
        if (error) {
          resultat(0);
        } else {
          if (results && results.length > 0) {
            resultat(1);
          } else {
            resultat(0);
          }
        }
      }
    )
  );
}

async function checkIfBlocked(user, otherUser) {
  return new Promise(resultat =>
    connection.query(
      "SELECT * FROM blocked WHERE userId = ? AND blockedId = ?",
      [user, otherUser],
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

exports.getSuggestion = (req, res) => {
  id = req.body.id;

  main();

  async function checkData() {
    return new Promise(
      resultat =>
        function () {
          if (id !== null) {
            resultat(1);
          } else {
            res.json({
              status: false,
              message: "error id",
              userMatch: null,
            });
            resultat(null);
          }
        }
    );
  }

  async function getUser(id) {
    return new Promise(resultat =>
      connection.query("SELECT * FROM users WHERE id = ?", [id], function (error, results, fields) {
        if (error) {
          resultat(null);
        } else {
          if (results && results.length > 0) {
            resultat(results);
          } else {
            resultat(null);
          }
        }
      })
    );
  }

  async function getOtherUser() {
    return new Promise(resultat =>
      connection.query(
        'SELECT * FROM users WHERE id != ? AND profileComplete = "1"',
        [id],
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

  async function main() {
    myUser = [];
    length = 0;
    
    if ((await checkData) !== null) {
      if ((myUser = await getUser(req.body.id)) !== null) {
        if ((users = await getOtherUser()) !== null) {
          length = users.length;
          console.log(length);
          usersMatch = await Promise.all(
            users.map(async function (user) {
              let sMatch = 0;
              if ((await checkIfBlocked(id, user.id)) === null && (await checkIfMatch(id, user.id)) === null) {
                sMatch += oriSexPoint(myUser, user); //OK
                sMatch += locatPoint(myUser, user); //OK
                sMatch += await tagsMatchPoint(myUser, user); //OK
                sMatch += Math.round(scorePoint(user)); //OK
              }
              let view = await checkIfView(id, user.id);

              return { ...user, sMatch: sMatch, filtre: 1, view: view};
            })
          );

          const sortByMapped = (map, compareFn) => (a, b) => compareFn(map(a), map(b));
          const byValue = (a, b) => b - a;
          const toMatch = usersMatch => usersMatch.sMatch;
          const byMatch = sortByMapped(toMatch, byValue);
          usersMatch = [...usersMatch].sort(byMatch); // Trie en fonction de sMatch

          while ((indexOfSM = usersMatch.findIndex(i => i.sMatch == 0)) && indexOfSM > -1) {
            usersMatch.splice(indexOfSM, 1); // on supprime tous les sMatch == 0
          }

          res.json(usersMatch);
        } else {
          res.json({
            status: false,
            message: "error get other user",
            userMatch: null,
          });
        }
      } else {
        res.json({
          status: false,
          message: "error get user",
          userMatch: null,
        });
      }
    } else {
      return;
    }
  }
};

exports.filtreUsersBy = (req, res) => {
  id = req.params.id;
  minAge = req.params.minAge;
  maxAge = req.params.maxAge;
  minScore = req.params.score;
  maxLoc = req.params.dist;
  minTag = req.params.tags;
  sortBy = req.params.sortBy;

  main();

  async function checkData() {
    return new Promise(resultat => {
      if (id !== null) {
        if (minAge !== null && minAge >= 0 && minAge < 150) {
          if (maxAge !== null && maxAge > 0 && maxAge <= 150) {
            if (minScore !== null && minScore >= 0 && minScore <= 99) {
              if (maxLoc !== null && maxLoc > 0) {
                if (sortBy !== null && minTag !== null && minTag >= 0) {
                  resultat(1);
                } else {
                  res.json({
                    status: false,
                    message: "error sortby or minTag data",
                    userMatch: null,
                  });
                  resultat(null);
                }
              } else {
                res.json({
                  status: false,
                  message: "error localisation score data",
                  userMatch: null,
                });
                resultat(null);
              }
            } else {
              res.json({
                status: false,
                message: "error filtre score data",
                userMatch: null,
              });
              resultat(null);
            }
          } else {
            res.json({
              status: false,
              message: "error filtre maxAge data",
              userMatch: null,
            });
            resultat(null);
          }
        } else {
          res.json({
            status: false,
            message: "error filtre minAge data",
            userMatch: null,
          });
          resultat(null);
        }
      } else {
        res.json({
          status: false,
          message: "error id",
          userMatch: null,
        });
        resultat(null);
      }
    });
  }

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

  function tagsMatch(user, otherUser) {
    return new Promise(resultat =>
      connection.query(
        "SELECT tag_id FROM user_tag WHERE user_id = ? OR user_id = ?",
        [user.id, otherUser.id],
        function (error, results, fields) {
          r = 0;
          for (var i = 0; i < results.length - 1; i++) {
            for (var j = i + 1; j < results.length; j++) {
              if (results[i].tag_id == results[j].tag_id) {
                r++;
              }
            }
          }
          resultat(r);
        }
      )
    );
  }

  function locat(user, otherUser) {
    lat1 = user.latitude;
    lat2 = otherUser.latitude;
    lon1 = user.longitude;
    lon2 = otherUser.longitude;
    if (lat1 == lat2 && lon1 == lon2) {
      dist = 0;
    } else {
      var radlat1 = (Math.PI * lat1) / 180;
      var radlat2 = (Math.PI * lat2) / 180;
      var theta = lon1 - lon2;
      var radtheta = (Math.PI * theta) / 180;
      var dist =
        Math.sin(radlat1) * Math.sin(radlat2) +
        Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
      if (dist > 1) {
        dist = 1;
      }
      dist = Math.acos(dist);
      dist = (dist * 180) / Math.PI;
      dist = dist * 60 * 1.1515;
      dist = dist * 1.609344;
    }
    return dist;
  }

  async function getOtherUser() {
    return new Promise(resultat =>
      connection.query(
        'SELECT * FROM users WHERE id != ? AND profileComplete = "1"',
        [id],
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

  async function main() {
    if ((await checkData()) === 1 && (myUser = await getUser(id)) !== null) {
      let usersSort = await getOtherUser();
      //filtre age
      if (req.params.suggestion && usersSort) {
        usersSort = await Promise.all(
          usersSort?.map(async function (user) {
            sMatch = 0;
            sMatch += oriSexPoint(myUser, user); //OK
            sMatch += locatPoint(myUser, user); //OK
            sMatch += await tagsMatchPoint(myUser, user); //OK
            sMatch += Math.round(scorePoint(user)); //OK

            let view = await checkIfView(id, user.id);

            return { ...user, sMatch: sMatch, filtre: 1 };
          })
        );
      }

      usersSort =
        usersSort &&
        (await Promise.all(
          usersSort?.map(async function (user) {
            let age = datefns.differenceInYears(new Date(), new Date(user.birthDate));
            if (user.id === 6) console.log(age);
            let dist = 0;
            dist = locat(myUser, user);
            tags = 0;
            tags = await tagsMatch(myUser, user);
            console.log(minAge, maxAge, minTag, maxLoc, minScore);

            let view = await checkIfView(id, user.id);

            if (
              age >= minAge &&
              age <= maxAge &&
              tags >= minTag &&
              dist <= maxLoc &&
              user.score >= minScore &&
              (await checkIfBlocked(id, user.id)) === null &&
              (await checkIfMatch(id, user.id)) === null
            ) {
              return { ...user, dist, tags, view };
            } else {
              return undefined;
            }
          })
        ));
      usersSort = usersSort.filter(user => user !== undefined);
      if (sortBy === "age") {
        usersSort.sort((a, b) => {
          if (datefns.isBefore(new Date(a.birthDate), new Date(b.birthDate))) {
            return 1;
          } else if (datefns.isBefore(new Date(b.birthDate), new Date(a.birthDate))) {
            return -1;
          } else 0;
        });
      } else if (sortBy === "local") {
        usersSort.sort((a, b) => {
          if (a.dist < b.dist) {
            return -1;
          } else if (a.dist > b.dist) {
            return 1;
          } else 0;
        });
      } else if (sortBy === "popu") {
        usersSort.sort((a, b) => {
          if (a.score > b.score) {
            return -1;
          } else if (a.score < b.score) {
            return 1;
          } else 0;
        });
      } else if (sortBy === "tags") {
        usersSort.sort((a, b) => {
          if (a.tags > b.tags) {
            return -1;
          } else if (a.tags < b.tags) {
            return 1;
          } else 0;
        });
      }

      res.json(usersSort);
    } else {
      res.json({
        status: false,
        message: "error wrong sort",
        usersSort: null,
      });
    }
  }
};

var connection = require('./../config/db');
var forEach = require('async-foreach').forEach;

exports.getSuggestion = (req,res) => {

    id = req.body.id;

    main();

    async function checkData() {
        return new Promise( resultat => function() {
            if (id !== null) {
              resultat(1);
            } else {
                res.json({
                    status:false,
                    message:'error id',
                    userMatch: null
               });
               resultat(null);
            }
        })
    };

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

    async function getOtherUser() {
        return new Promise( resultat => 
            connection.query('SELECT * FROM users WHERE id != ? AND profileComplete = "1"',[id], function (error, results, fields) {
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

    function oriSex(user, otherUser) {
      if (user.gender == 1 && (user.showMe == 1 || user.showMe == 3) && otherUser.gender == 1 && (otherUser.showMe == 1 || otherUser.showMe == 3))
        return 5;
      else if (user.gender == 1 && (user.showMe == 2 || user.showMe == 3) && otherUser.gender == 2 && (otherUser.showMe == 1 || otherUser.showMe == 3))
        return 5;
      else if (user.gender == 2 && (user.showMe == 1 || user.showMe == 3) && otherUser.gender == 1 && (otherUser.showMe == 2 || otherUser.showMe == 3))
        return 5;
      else if (user.gender == 2 && (user.showMe == 2 || user.showMe == 3) && otherUser.gender == 2 && (otherUser.showMe == 2 || otherUser.showMe == 3))
        return 5;
      else
        return 0;
    };

    function locat(user, otherUser) {
            lat1 = user[0].latitude;
            lat2 = otherUser.latitude;
            lon1 = user[0].longitude;
            lon2 = otherUser.longitude;
            if ((lat1 == lat2) && (lon1 == lon2)) {
                dist = 0;
            }
            else {
                var radlat1 = Math.PI * lat1/180;
                var radlat2 = Math.PI * lat2/180;
                var theta = lon1-lon2;
                var radtheta = Math.PI * theta/180;
                var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                if (dist > 1) {
                    dist = 1;
                }
                dist = Math.acos(dist);
                dist = dist * 180/Math.PI;
                dist = dist * 60 * 1.1515;
                dist = dist * 1.609344;
            }
            if (dist < 10)
              return 4;
            else if (dist < 50)
              return(3);
            else if (dist < 100)
              return(2);
            else if (dist < 200)
              return(1);
            else
              return(0);
    };

    function tagsMatch(user, otherUser) {
      return new Promise( resultat => 
        connection.query('SELECT tag_id FROM user_tag WHERE user_id = ? OR user_id = ?',[user[0].id, otherUser.id], function (error, results, fields) {
          r = -1;
          for (var i = 0; i < results.length-1; i++) {
            for (var j = i+1; j < results.length; j++) {
                if (results[i].tag_id == results[j].tag_id) {
                    r++;
                };
            };
          };
          if (r > 5)
            r = 4;
          else if (r >= 3)
            r = 3;
          else if (r >= 2)
            r = 2;
          else if (r >= 1)
            r = 1;
          else
            r = 0;
          resultat(r);
        })
      )
    };

    function score(user) {
      if (user.score == 0)
        return(0);
      else
        return(user.score / 20);
    };

    async function main() {
        myUser = [];
        length = 0;
        console.log('test');
        if ((await checkData) !== null) {
            if ((myUser = await getUser(req.body.id)) !== null) {
                if ((users = await getOtherUser()) !== null) {
                    length = users.length;
                    console.log(length);
                    usersMatch = await Promise.all(users.map(async function(user) {
                        sMatch = 0;
                        sMatch += oriSex(myUser, user); //OK
                        sMatch += locat(myUser, user);//OK
                        sMatch += await tagsMatch(myUser, user); //OK
                        sMatch += Math.round(score(user)); //OK
                        
                        return {...user, sMatch: sMatch, filtre: 1};
                    }));

                    const sortByMapped = (map,compareFn) => (a,b) => compareFn(map(a),map(b));
                    const byValue = (a,b) => b - a;
                    const toMatch = usersMatch => usersMatch.sMatch;
                    const byMatch = sortByMapped(toMatch,byValue);
                    usersMatch = [...usersMatch].sort(byMatch); // Trie en fonction de sMatch

                    while ((indexOfSM = usersMatch.findIndex(i => i.sMatch == 0)) && indexOfSM > -1) {
                      usersMatch.splice(indexOfSM, 1); // on supprime tous les sMatch == 0
                    }

                    res.json( usersMatch
                   );
                } else {
                    res.json({
                        status:false,
                        message:'error get other user',
                        userMatch: null
                   });
                }
            } else {
                res.json({
                    status:false,
                    message:'error get user',
                    userMatch: null
               });
            }
        } else {
            return ;
        }
    };
}

exports.sortUsersBy = (req,res) => {
  usersSort = req.body.users;

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

function tagsMatch(user, otherUser) {
  return new Promise( resultat => 
    connection.query('SELECT tag_id FROM user_tag WHERE user_id = ? OR user_id = ?',[user[0].id, otherUser.id], function (error, results, fields) {
      r = -1;
      for (var i = 0; i < results.length-1; i++) {
        for (var j = i+1; j < results.length; j++) {
            if (results[i].tag_id == results[j].tag_id) {
                r++;
            };
        };
      };
      resultat(r);
    })
  )
};

function locat(user, otherUser) {
  lat1 = user[0].latitude;
  lat2 = otherUser.latitude;
  lon1 = user[0].longitude;
  lon2 = otherUser.longitude;
  if ((lat1 == lat2) && (lon1 == lon2)) {
      dist = 0;
  }
  else {
    var radlat1 = Math.PI * lat1/180;
    var radlat2 = Math.PI * lat2/180;
    var theta = lon1-lon2;
    var radtheta = Math.PI * theta/180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
        dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344;
  }
  return dist;
};

  async function main() {
    if ((myUser = await getUser(req.body.id)) !== null) {
      if (req.body.sort && req.body.sort && req.body.sort === "age") {//OK
        usersSort = await Promise.all(usersSort.map(async function(user) {
          date = new Date(user.birthDate);
          diff = Date.now() - date.getTime();
          age = new Date(diff);

          age = Math.abs(age.getUTCFullYear() - 1970);
          if (user.age && (user.age = age))
            return user;
          else
            return {...user, age: age};
        }));

        const sortByMapped = (map,compareFn) => (a,b) => compareFn(map(a),map(b));
        const byValue = (a,b) => a - b;
        const toAge = usersSort => usersSort.age;
        const byAge = sortByMapped(toAge,byValue);
        usersSort = [...usersSort].sort(byAge); // Trie en fonction de l'age croissant

        //console.log(usersSort);
        
        res.json({
          status:true,
          message: 'sort by age',
          usersSort: usersSort
        });
      } else if (req.body.sort === "local") {//OK
        usersSort = await Promise.all(usersSort.map(async function(user) {
          dist = 0;
          dist = locat(myUser, user);
          return {...user, dist: dist};
        }));

        const sortByMapped = (map,compareFn) => (a,b) => compareFn(map(a),map(b));
        const byValue = (a,b) => a - b;
        const toLoc = usersSort => usersSort.dist;
        const byLoc = sortByMapped(toLoc,byValue);
        usersSort = [...usersSort].sort(byLoc); // Trie en fonction de la distance entre moi et l'autre croissante
        //console.log(usersSort);

        res.json({
          status:true,
          message: 'sort by localisation',
          usersSort: usersSort
        });
      } else if (req.body.sort === "popu") {//OK
        const sortByMapped = (map,compareFn) => (a,b) => compareFn(map(a),map(b));
        const byValue = (a,b) => b - a;
        const toScore = usersSort => usersSort.score;
        const byScore = sortByMapped(toScore,byValue);
        usersSort = [...usersSort].sort(byScore); // Trie en fonction de la distance entre moi et l'autre croissante
        console.log(usersSort);
        
        res.json({
          status:true,
          message: 'sort by popularity',
          usersSort: usersSort
        });
      } else if (req.body.sort === "tags") {//OK
        usersSort = await Promise.all(usersSort.map(async function(user) {
          tags = 0;
          tags = await tagsMatch(myUser, user);
          return {...user, tags: tags};
        }));

        const sortByMapped = (map,compareFn) => (a,b) => compareFn(map(a),map(b));
        const byValue = (a,b) => b - a;
        const toTags = usersSort => usersSort.tags;
        const byTags = sortByMapped(toTags,byValue);
        usersSort = [...usersSort].sort(byTags); // Trie en fonction de la distance entre moi et l'autre croissante
        //console.log(usersSort);

        res.json({
          status:true,
          message: 'sort by tags',
          usersSort: usersSort
        });
      } else {
        res.json({
          status:false,
          message:'error wrong sort',
          usersSort: null
        });
      }
    } else {
      res.json({
        status:false,
        message:'error get user',
        usersSort: null
      });
    }
  }
}

exports.filtreUsersBy = (req,res) => {
  usersSort = req.body.users;
  minAge = req.body.minAge;
  maxAge = req.body.maxAge;
  minScore = req.body.minScore;
  maxLoc = req.body.maxLoc;
  minTag = req.body.minTag;

  main();

  async function checkData() {
    return new Promise( resultat => function() {
        if (id !== null) {
            if (minAge !== null && minAge >= 0 && minAge < 150) {
                if (maxAge !== null && maxAge > 0 && maxAge <= 150) {
                    if (minScore !== null && minScore >= 0 && minScore <= 99) {
                        if (maxLoc !== null && maxLoc > 0) {
                            if (sortBy !== null && minTag !== null && minTag > 0) {
                                resultat(1);
                            } else {
                                res.json({
                                    status:false,
                                    message:'error sortby or minTag data',
                                    userMatch: null
                               });
                               resultat(null);
                            }
                        } else {
                            res.json({
                                status:false,
                                message:'error localisation score data',
                                userMatch: null
                           });
                           resultat(null);
                        }
                    } else {
                        res.json({
                            status:false,
                            message:'error filtre score data',
                            userMatch: null
                       });
                       resultat(null);
                    }
                } else {
                    res.json({
                        status:false,
                        message:'error filtre maxAge data',
                        userMatch: null
                   });
                   resultat(null);
                }
            } else {
                res.json({
                    status:false,
                    message:'error filtre minAge data',
                    userMatch: null
               });
               resultat(null);
            }
        } else {
            res.json({
                status:false,
                message:'error id',
                userMatch: null
           });
           resultat(null);
        }
    })
};

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

function tagsMatch(user, otherUser) {
  return new Promise( resultat => 
    connection.query('SELECT tag_id FROM user_tag WHERE user_id = ? OR user_id = ?',[user[0].id, otherUser.id], function (error, results, fields) {
      r = -1;
      for (var i = 0; i < results.length-1; i++) {
        for (var j = i+1; j < results.length; j++) {
            if (results[i].tag_id == results[j].tag_id) {
                r++;
            };
        };
      };
      resultat(r);
    })
  )
};

function locat(user, otherUser) {
  lat1 = user[0].latitude;
  lat2 = otherUser.latitude;
  lon1 = user[0].longitude;
  lon2 = otherUser.longitude;
  if ((lat1 == lat2) && (lon1 == lon2)) {
      dist = 0;
  }
  else {
    var radlat1 = Math.PI * lat1/180;
    var radlat2 = Math.PI * lat2/180;
    var theta = lon1-lon2;
    var radtheta = Math.PI * theta/180;
    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
    if (dist > 1) {
        dist = 1;
    }
    dist = Math.acos(dist);
    dist = dist * 180/Math.PI;
    dist = dist * 60 * 1.1515;
    dist = dist * 1.609344;
  }
  return dist;
};

  async function main() {
    if (checkData() !== null) {
      if ((myUser = await getUser(req.body.id)) !== null) {
        //filtre age
          usersSort = await Promise.all(usersSort.map(async function(user) {
            date = new Date(user.birthDate);
            diff = Date.now() - date.getTime();
            age = new Date(diff);
  
            age = Math.abs(age.getUTCFullYear() - 1970);
            if (age >= minAge && age <= maxAge)
              user.filtre = 1;
            else
              user.filtre = 0;
            return user;
          }));

          //filtre l
          usersSort = await Promise.all(usersSort.map(async function(user) {
            dist = 0;
            dist = locat(myUser, user);
            if (dist <= maxLoc && user.filtre == 1)
              user.filtre = 1;
            else {
              user.filtre = 0;
            }
            return user;
          }));

          //filtre tags
          usersSort = await Promise.all(usersSort.map(async function(user) {
            if (user.score >= minScore && user.filtre == 1)
              filtre = 1;
            else {
              user.filtre = 0;
            }
            return user;
          }));

          //filtre tags
          usersSort = await Promise.all(usersSort.map(async function(user) {
            tags = 0;
            tags = await tagsMatch(myUser, user);

            if (tags >= minTag && user.filtre == 1)
              user.filtre = 1;
            else {
              user.filtre = 0;
            }
            return user;
          }));
  
          res.json({
            status:true,
            message: 'Filtre by age, score, localisation and tags',
            usersSort: usersSort
          });
      } else {
        res.json({
          status:false,
          message:'error wrong sort',
          usersSort: null
        });
      }
    } else {
      res.json({
        status:false,
        message:'error get user',
        usersSort: null
      });
    }
  }
}
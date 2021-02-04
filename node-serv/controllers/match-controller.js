var connection = require('./../config/db');
var forEach = require('async-foreach').forEach;

exports.getSuggestion = (req,res) => {

    id = req.body.id;
    minAge = req.body.minAge;
    maxAge = req.body.maxAge;
    minScore = req.body.minScore;
    minLoc = req.body.minLoc;
    sortBy = req.body.sortBy;

    main();

    async function checkData() {
        return new Promise( resultat => function() {
            if (id !== null) {
                if (minAge !== null && minAge >= 0 && minAge < 150) {
                    if (maxAge !== null && maxAge > 0 && maxAge <= 150) {
                        if (minScore !== null && minScore >= 0 && minScore <= 5) {
                            if (minLoc !== null) {
                                if (sortBy !== null && minLoc > 0 && minLoc <= 4) {
                                    resultat(1);
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
      if (user[0].gender == 1 && (user[0].showMe == 1 || user[0].showMe == 3) && otherUser.gender == 1 && (otherUser.showMe == 1 || otherUser.showMe == 3))
        return 5;
      else if (user[0].gender == 1 && (user[0].showMe == 2 || user[0].showMe == 3) && otherUser.gender == 2 && (otherUser.showMe == 1 || otherUser.showMe == 3))
        return 5;
      else if (user[0].gender == 2 && (user[0].showMe == 1 || user[0].showMe == 3) && otherUser.gender == 1 && (otherUser.showMe == 2 || otherUser.showMe == 3))
        return 5;
      else if (user[0].gender == 2 && (user[0].showMe == 2 || user[0].showMe == 3) && otherUser.gender == 2 && (otherUser.showMe == 2 || otherUser.showMe == 3))
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
          r = 0;
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
                        
                        return {...user, sMatch: sMatch};
                    }));

                    const sortByMapped = (map,compareFn) => (a,b) => compareFn(map(a),map(b));
                    const byValue = (a,b) => b - a;
                    const toMatch = usersMatch => usersMatch.sMatch;
                    const byMatch = sortByMapped(toMatch,byValue);
                    usersMatch = [...usersMatch].sort(byMatch); // Trie en fonction de sMatch

                    while ((indexOfSM = usersMatch.findIndex(i => i.sMatch == 0)) && indexOfSM > -1) {
                      usersMatch.splice(indexOfSM, 1); // on supprime tous les sMatch == 0
                    }

                    res.json({
                        status:true,
                        message: 'get other user and sMatch',
                        userMatch: usersMatch
                   });
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

  async function calcAge(users) {
    age = 0;
    return age;
  }

  async function sortAge(users) {
    usersSort = await Promise.all(users.map(async function(user) {
      age = calcAge(user.birthDate);
      return {...user, age: age};
    }));
  }

  async function main() {
    if (req.body.sort === "age") {
      //usersSort = await sortAge(usersSort);
      console.log
      res.json({
        status:true,
        message: 'sort by age',
        userMatch: usersSort
      });
    } else if (req.body.sort === "local") {
      
      res.json({
        status:true,
        message: 'sort by localisation',
        userMatch: usersSort
      });
    } else if (req.body.sort === "popu") {
      
      res.json({
        status:true,
        message: 'sort by popularity',
        userMatch: usersSort
      });
    } else if (req.body.sort === "tags") {
      
      res.json({
        status:true,
        message: 'sort by tags',
        userMatch: usersSort
      });
    } else {
      res.json({
        status:false,
        message:'error wrong sort',
        userMatch: null
      });
    }
  };
}
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
                            if (minLoc !== null && minLoc >= 0 && minLoc <= 1000) {
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

    async function getUser() {
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
            connection.query('SELECT * FROM users WHERE id != ?',[id], function (error, results, fields) {
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
        myUser = [];
        console.log('test');
        if ((await checkData) !== null) {
            if ((myUser = await getUser()) !== null) {
                if ((users = await getOtherUser()) !== null) {
                    usersMatch = await Promise.all(users.map(async function(user) {
                        sMatch = 0;
                        console.log('test');
                        return {...user, sMatch: sMatch};
                    }));
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
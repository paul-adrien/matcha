var connection = require('./../config/db');
var forEach = require('async-foreach').forEach;

exports.likeOrDislike = (req,res) => {

    main();

    async function addMatch() {
        return new Promise( resultat => 
            connection.query('SELECT * FROM users_like WHERE liked_id = ? AND like_id = ?',[req.body.user_id, req.body.like_id], function (error, results, fields) {
                if (error) {
                    resultat(null);
                } else {
                    if (results && results.length > 0) {
                        connection.query('INSERT INTO matched (user_id1, user_id2, active) VALUES (?, ?, 0)',[req.body.like_id, req.body.user_id], function (error, results, fields) {
                            if (error) {
                                resultat(error);
                            } else {
                                resultat(1);
                            }
                        });
                    }
                    else{
                        resultat(2);
                    }
                }
            })
        )
    };

    async function delMatch() {
        return new Promise( resultat => 
            connection.query('SELECT * FROM users_like WHERE liked_id = ? AND like_id = ?',[req.body.user_id, req.body.like_id], function (error, results, fields) {
                if (error) {
                    resultat(null);
                } else {
                    if (results && results.length > 0) {
                        connection.query('DELETE FROM matched WHERE (user_id1 = ? AND user_id2 = ?) OR (user_id1 = ? AND user_id2 = ?)',[req.body.like_id, req.body.user_id, req.body.user_id, req.body.like_id], function (error, results, fields) {
                            if (error) {
                                resultat(error);
                            } else {
                                resultat(1);
                            }
                        });
                    }
                    else{
                        resultat(2);
                    }
                }
            })
        )
    };

    async function lOrD() {
        return new Promise( resultat => 
            connection.query('SELECT * FROM users_like WHERE liked_id = ? AND like_id = ?',[req.body.like_id, req.body.user_id], function (error, results, fields) {
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

    async function addLike() {
        return new Promise( resultat =>
            connection.query('INSERT INTO users_like (liked_id, like_id) VALUES (?, ?)',[req.body.like_id, req.body.user_id], function (error, results, fields) {
                if (error) {
                    resultat(null);
                } else {
                    connection.query('UPDATE users SET nbLikes = nbLikes+1 WHERE id = ?',[req.body.like_id], function (error, results, fields) {
                        if (error) {
                            resultat(null);
                        } else {
                            resultat(1);
                        }
                    });
                }
            })
        )
    };

    async function delLike() {
        return new Promise( resultat =>
            connection.query('DELETE FROM users_like WHERE liked_id = ? AND like_id = ?',[req.body.like_id, req.body.user_id], function (error, results, fields) {
                if (error) {
                    resultat(null);
                } else {
                    connection.query('UPDATE users SET nbLikes = nbLikes-1 WHERE id = ?',[req.body.like_id], function (error, results, fields) {
                        if (error) {
                            resultat(error);
                        } else {
                            resultat(1);
                        }
                    });
                }
            })
        )
    };

    function notifLike(mode) {
        if (mode == 1) {
            connection.query('SELECT * FROM notif WHERE userId = ? AND type = "matched"',[req.body.like_id], function (error, results, fields) {
                if (error) {
                    return null;
                } else {
                    if (results && results.length > 0) {
                        connection.query('UPDATE notif SET date = DATE(NOW()), see = 0 WHERE userId = ? AND type = "matched"',[req.body.like_id], function (error, results, fields) {
                            if (error) {
                                return null;
                            } else {
                                return(1);
                            }
                        });
                    } else {
                        connection.query('INSERT INTO notif (userId, otherId, type, date) VALUES (?, ?, "matched", DATE(NOW()))',[req.body.like_id, req.body.user_id], function (error, results, fields) {
                            if (error) {
                                return null;
                            } else {
                                return(1);
                            }
                        });
                    }
                }
            });
        } else {
            connection.query('SELECT * FROM notif WHERE userId = ? AND type = "like"',[req.body.like_id], function (error, results, fields) {
                if (error) {
                    return null;
                } else {
                    if (results && results.length > 0) {
                        connection.query('UPDATE notif SET date = DATE(NOW()), see = 0 WHERE userId = ? AND type = "like"',[req.body.like_id], function (error, results, fields) {
                            if (error) {
                                return null;
                            } else {
                                return(1);
                            }
                        });
                    } else {
                        connection.query('INSERT INTO notif (userId, otherId, type, date) VALUES (?, ?, "like", DATE(NOW()))',[req.body.like_id, req.body.user_id], function (error, results, fields) {
                            if (error) {
                                return null;
                            } else {
                                return(1);
                            }
                        });
                    }
                }
            });
        }
    }

    function notifDisLike() {
        connection.query('SELECT * FROM notif WHERE userId = ? AND type = "unMatched"',[req.body.like_id], function (error, results, fields) {
            if (error) {
                return null;
            } else {
                if (results && results.length > 0) {
                    connection.query('UPDATE notif SET date = DATE(NOW()), see = 0 WHERE userId = ? AND type = "unMatched"',[req.body.like_id], function (error, results, fields) {
                        if (error) {
                            return null;
                        } else {
                            return(1);
                        }
                    });
                } else {
                    connection.query('INSERT INTO notif (userId, otherId, type, date) VALUES (?, ?, "unMatched", DATE(NOW()))',[req.body.like_id, req.body.user_id], function (error, results, fields) {
                        if (error) {
                            return null;
                        } else {
                            return(1);
                        }
                    });
                }
            }
        });
    }

    async function checkIfBlocked() {
        return new Promise(resultat =>
        connection.query(
            "SELECT * FROM blocked WHERE userId = ? AND blockedId = ?",
            [req.body.like_id, req.body.user_id],
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
        mode = await lOrD();
        if (mode === null) {
            if (await addLike()){
                if ((match = await addMatch())) {
                    if (match == 1) {
                        if (checkIfBlocked() === null)
                            notifLike(1);
                        res.json(200);
                    } else {
                        if (checkIfBlocked() === null)
                            notifLike(2);
                        res.json(200);
                    }
                } else {
                    res.json({
                        status:false,
                        message:'error add match',
                   });
                }
            } else {
                res.json({
                    status:false,
                    message:'error add like',
               });
            }
        } else {
            if (await delLike()){
                if ((match = await delMatch())) {
                    if (match == 1) {
                        if (checkIfBlocked() === null)
                            notifDisLike();
                        res.json(201);
                    } else
                        res.json(201);
                } else {
                    res.json({
                        status:false,
                        message:'error del match',
                   });
                }
            } else {
                res.json({
                    status:false,
                    message:'error del like',
               });
            }
        }
    };
}
 
exports.whoLikeMe = (req,res) => {

    var resultat = [];

    takeAllUsers(resultat);

    async function getUsersId() {
        return new Promise( resultat => 
            connection.query('SELECT like_id FROM users_like WHERE liked_id = ?',[req.body.user_id], function (error, results, fields) {
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

    async function getUserViews(id) {
        return new Promise( resultat =>
            connection.query('SELECT * FROM users WHERE id = ?',[id], function (error, results, fields) {
                if (error) {
                    resultat(null);
                } else {
                    resultat(results);
                }
            })
        )
    };

    async function funForEach(users) {
        var i = 0;
        return new Promise(resolve => {
            forEach(users, async function(user) {
                result = await getUserViews(user['like_id'])
                if(result && result.length > 0){
                    if (!resultat || resultat.length === 0)
                        resultat = [result[0]];
                    else
                        resultat.push(result[0]);
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
        if (users !== null)
        {
            resultat = await funForEach(users)
            
            if (resultat !== null)
            {
                res.json({
                    status:true,
                    message:'like user',
                    users: resultat
               });
            }
        }
        else {
            res.json({
                status:false,
                message:'pas de like',
                users: null
            });
        }
    };
}

exports.likeOrNot = (req,res) => {

    likeOrNot();
    async function getIfLike() {
        return new Promise( resultat => 
            connection.query('SELECT * FROM users_like WHERE liked_id = ? AND like_id = ?',[req.params.likeId, req.params.userId], function (error, results, fields) {
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

    async function likeOrNot() {
        like = await getIfLike();
        if (like !== null)
        {
            res.json(200);
        }
        else {
            res.json({
                status:false,
                message:'pas de like',
                like: 0
            });
        }
    };
}

var connection = require('./../config/db');
var forEach = require('async-foreach').forEach;

exports.likeOrDislike = (req,res) => {

    main();

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
                    resultat(error);
                } else {
                    connection.query('UPDATE users SET nbLikes = nbLikes+1 WHERE id = ?',[req.body.like_id], function (error, results, fields) {
                        if (error) {
                            resultat(error);
                        } else {
                            resultat(results);
                        }
                    });
                }
            })
        )
    };

    async function dellLike() {
        return new Promise( resultat =>
            connection.query('DELETE FROM users_like WHERE liked_id = ? AND like_id = ?',[req.body.like_id, req.body.user_id], function (error, results, fields) {
                if (error) {
                    resultat(error);
                } else {
                    connection.query('UPDATE users SET nbLikes = nbLikes-1 WHERE id = ?',[req.body.like_id], function (error, results, fields) {
                        if (error) {
                            resultat(error);
                        } else {
                            resultat(results);
                        }
                    });
                }
            })
        )
    };

    async function main() {
        mode = await lOrD();
        if (mode === null) {
            result = await addLike();
            res.json({
                status:true,
                message:'like user',
           });
        } else {
            result = await dellLike();
            res.json({
                status:true,
                message:'unlike user',
           });
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
        if (users !== undefined)
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
            connection.query('SELECT * FROM users_like WHERE liked_id = ? AND like_id',[req.body.like_id, req.body.user_id], function (error, results, fields) {
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
            res.json({
                status:true,
                message:'like',
                like: 1
            });
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

var connection = require('./../config/db');
var forEach = require('async-foreach').forEach;
 
exports.takeViewProfil = (req,res) => {

    var resultat = [];

    takeAllUsers(resultat);

    async function getUsersId() {
        return new Promise( resultat => 
            connection.query('SELECT views_id FROM users_views WHERE viewed_id = ?',[req.body.user_id], function (error, results, fields) {
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
                result = await getUserViews(user['views_id'])
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
                    message:'views user',
                    users: resultat
               });
            }
        }
        else {
            res.json({
                status:false,
                message:'pas de vue2',
                users: null
            });
        }
    };
}

exports.viewedProfil = (req,res) => {
    var user_id = req.params.id;
    var viewed_id = req.body.viewed_id;

    main();

    async function checkView() {
        return new Promise( resultat => 
            connection.query('SELECT * FROM users_views WHERE viewed_id = ? and user_id',[user_id, viewed_id], function (error, results, fields) {
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

    async function addView() {
        return new Promise( resultat =>
            connection.query('INSERT INTO users_views (viewed_id, views_id) VALUES (?, ?)',[viewed_id, user_id], function (error, results, fields) {
                if (error) {
                    resultat(null);
                } else {
                    resultat(1);
                }
            })
        )
    };

    
    async function main() {
        check = await checkView();
        if (check === null)
        {
            if ((await addView()))
            {
                notifView()
                res.json({
                    status:true,
                    message:'profile view'
               });
            }
        }
        else {
            res.json({
                status:true,
                message:'profile already view'
            });
        }
    };
}

exports.getUser = (req,res) => {
    var id = req.body.id;

    connection.query('SELECT * FROM users WHERE id = ?',[id], function (error, results, fields) {
        if (error) {
            res.json({
                status:false,
                message:'there are some error with query select user',
                user: null
            })
        } else {
            if(results.length > 0){
                res.json(
                    results[0]
                )
            } else {
                res.json({
                    status:false,
                    message:"User does not exist",
                    user: null
                });
            }
        }
    });
}

exports.updatePosition = (req,res) => {
    var id = req.params.id;
    var lat = req.body.latitude;
    var long = req.body.longitude;
    console.log(id)

    connection.query('UPDATE users SET latitude = ?, longitude = ? WHERE id = ?',[lat, long, id], function (error, results, fields) {
        if (error) {
            res.json({
                status:false,
                message:'there are some error with query update user position',
                user: null
            })
        } else {
            res.json("Position update !")
        }
    });
}
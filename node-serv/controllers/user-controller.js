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
        if (users !== undefined)
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

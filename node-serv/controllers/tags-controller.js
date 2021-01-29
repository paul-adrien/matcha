var connection = require('./../config/db');
var forEach = require('async-foreach').forEach;
  
exports.getAllTags = (req,res) => {

    connection.query('SELECT * FROM tag',[], function (error, results, fields) {
        if (error) {
            res.json({
                status:false,
                message:'there are some error with query select user',
                tags: null
            })
        } else {
            if(results.length > 0){
                res.json({
                    status: true,
                    message:'successfully get tag(s)',
                    tags: results,
                })
            } else {
                res.json({
                    status:false,
                    message:"dont find any tag(s)",
                    tags: null
                });
            }
        }
    });
}

exports.getYourTags = (req,res) => {
    resultat = [];

    getAllTags();

    async function getTagsId(id) {
        return new Promise( resultat => 
            connection.query('SELECT tag_id FROM user_tag WHERE user_id = ?',[id], function (error, results, fields) {
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

    async function getTagName(id) {
        return new Promise( resultat => 
            connection.query('SELECT name FROM tag WHERE id = ?',[id], function (error, results, fields) {
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

    async function getAllName(tags_id) {
        var i = 0;
        return new Promise(resolve => {
            forEach(tags_id, async function(tag) {
                result = await getTagName(tag['tag_id'])
                if(result && result.length > 0){
                    if (!resultat || resultat.length === 0)
                        resultat = [result[0]];
                    else
                        resultat.push(result[0]);
                }
                i++;
                if (i === tags_id.length) {
                    resolve(resultat);
                }
            });
        });
    }

    async function getAllTags() {
        tags_id = await getTagsId(req.body.id);
        if (tags_id !== null)
        {
            resultat = await getAllName(tags_id)
            
            if (resultat !== null)
            {
                res.json({
                    status:true,
                    message:'tags user',
                    tags: resultat
               });
            }
        }
        else {
            res.json({
                status:false,
                message:'pas de tag',
                tags: null
            });
        }
    };
}

exports.addExistTag = (req,res) => {

    addTags();

    async function checkIfTag(tag_id, user_tag) {
        return new Promise( resultat => 
            connection.query('SELECT * FROM user_tag WHERE tag_id = ? AND user_id = ?',[tag_id, user_tag], function (error, results, fields) {
                if (error) {
                    resultat(null);
                } else {
                    if (results && results.length > 0) {
                        resultat(1);
                    }
                    else{
                        resultat(null);
                    }
                }
            })
        )
    };

    async function addTags() {
        if ((await checkIfTag(req.body.tag_id, req.body.user_id)) === null) {
            connection.query('INSERT INTO user_tag (tag_id, user_id) VALUES (?, ?)',[req.body.tag_id, req.body.user_id], function (error, results, fields) {
                if (error) {
                    res.json({
                        status:false,
                        message:'tag was not insert'
                    });
                } else {
                    res.json({
                        status:true,
                        message:'tag was add'
                    });
                }
            });
        } else {
            res.json({
                status:false,
                message:'tag already exist'
            });
        }
    };
    
    
}

exports.addNonExistTag = (req,res) => {
    resultat = [];

    getAllTags();

    async function getTagId() {
        return new Promise( resultat => 
            connection.query('SELECT id FROM tag WHERE name = ?',[req.body.name], function (error, results, fields) {
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

    async function checkIfTag(tag_id, user_tag) {
        return new Promise( resultat => 
            connection.query('SELECT * FROM user_tag WHERE tag_id = ? AND user_id = ?',[tag_id, user_tag], function (error, results, fields) {
                if (error) {
                    resultat(null);
                } else {
                    if (results && results.length > 0) {
                        resultat(1);
                    }
                    else{
                        resultat(null);
                    }
                }
            })
        )
    };

    async function insertUserTag(id) {
        return new Promise( resolve => 
            connection.query('INSERT INTO user_tag (tag_id, user_id) VALUES (?, ?)',[id, req.body.id], function (error, results, fields) {
                if (error) {
                    resolve(null);
                } else {
                    resolve(1);
                }
            })
        )
    };

    async function insertTag() {
        return new Promise( resolve => 
            connection.query('INSERT INTO tag (name) VALUES (?)',[req.body.name], function (error, results, fields) {
                if (error) {
                    resolve(null);
                } else {
                    resolve(1);
                }
            })
        )
    };

    async function getAllTags() {
        if (req.body.name && req.body.name.length > 0 && req.body.name[0] == '#') {
            tags_id = await getTagId();
            if (tags_id === null)
            {
                resultat = await insertTag()
                
                if (resultat && resultat == 1)
                {
                    tags_id = await getTagId();
                    if (tags_id && tags_id.length > 0) {
                        await insertUserTag(tags_id[0]['id'])
                    } else {
                        res.json({
                            status:false,
                            message:'erreur get id tag',
                            tags: null
                        });
                    }
                    res.json({
                        status:true,
                        message:'tags user insert',
                        tags: resultat
                });
                }
            }
            else {
                if ((await checkIfTag(tags_id[0]['id'], req.body.id)) === null) {
                    if ((await insertUserTag(tags_id[0]['id']))) {
                        res.json({
                            status:true,
                            message:'tags already exist and insert usertag',
                            tags: resultat
                        });
                    } else {
                        res.json({
                            status:false,
                            message:'tag was not insert usertag',
                            tags: resultat
                        });
                    }
                } else {
                    res.json({
                        status:false,
                        message:'tag already exist',
                        tags: resultat
                    });
                }
                
            }
        } else {
            res.json({
                status:false,
                message:'tag was not valid',
                tags: resultat
            });
        }
    };
}
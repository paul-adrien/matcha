var connection = require('./../config/db');

const fs = require('fs');


async function verifIfDbExist(id) {
  return new Promise(resultat =>
    connection.query("SELECT id FROM users", function (error, results, fields) {
      if (error) {
        resultat(null);
      } else {
        if (results && results.length > 0) {
          resultat(1);
        } else {
          resultat(1);
        }
      }
    })
  );
}

async function getUser(id) {
  return new Promise(resultat =>
    connection.query("SELECT * FROM users", function (error, results, fields) {
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

exports.installDb = (req,res) => {
  if (req.body.password != "AdminMatcha") {
		res.status(401).json({ message: "Unauthorized 401 : Can't install you need to use the good password" });
		return;
	}
  let query = fs.readFileSync('./seed/databaseMatcha.sql', 'utf8');
  query = query.trim();
  query = query.split(';');

  query.forEach(async (x, index) => {
      if (x !== undefined && x.length > 0)
        await connection.query(x);
  })

	res.status(200).json({ message: 'Install Database SUCCESS' });
}

exports.addSeed = async (req,res) => {
  if (req.body.password != "AdminMatcha") {
		res.status(401).json({ message: "Unauthorized 401 : Can't install you need to use the good password" });
		// console.log("Unauthorized 401 : Can't install you need to use the instalation password");
		return;
  }
  if ((await verifIfDbExist()) !== 1) {
    res.status(200).json({ message: 'error with database' });
    return;
  }
  if (req.body.seed === "1000users") {
		connection.query('DELETE FROM users');
    connection.query('ALTER TABLE users AUTO_INCREMENT =0');
    let query = fs.readFileSync('./seed/1000users.sql', 'utf8');
    query = query.trim();
    query = query.split('|');

    query.forEach(async (x) => {
        if (x !== undefined && x.length > 0)
          await connection.query(x);
    })

    res.status(200).json({ message: 'add seed 1000users SUCCESS' });
  } else if (req.body.seed === "48users") {
    connection.query('DELETE FROM users');
    connection.query('ALTER TABLE users AUTO_INCREMENT =0');
    let query = fs.readFileSync('./seed/48users.sql', 'utf8');
    query = query.trim();
    query = query.split('|');

    query.forEach(async (x) => {
        if (x !== undefined && x.length > 0)
          await connection.query(x);
    })

    res.status(200).json({ message: 'add seed 48users SUCCESS' });
  } else if (req.body.seed === "tag") {
    connection.query('DELETE FROM tag');
    connection.query('DELETE FROM user_tag');
    connection.query('ALTER TABLE tag AUTO_INCREMENT =0');
    let query = fs.readFileSync('./seed/tag.sql', 'utf8');
    query = query.trim();
    query = query.split('|');

    query.forEach(async (x) => {
        if (x !== undefined && x.length > 0)
          await connection.query(x);
    });

    users = await getUser();
    i = 1
    if (users !== null) {
      await Promise.all(
        users.map(async function (user) {
          if (i > 29)
            i = 1;
          connection.query('INSERT INTO user_tag (tag_id, user_id) VALUES (?, ?)', [i, user.id]);
          i++;
        })
      );
      res.status(200).json({ message: 'add seed tag SUCCESS' });
    } else {
      res.status(400).json({ message: 'No users' });
    }
  } else {
    res.status(400).json({ message: 'wrong parameters' });
  }
}
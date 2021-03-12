var connection = require('./../config/db');

const fs = require('fs');

exports.installDb = (req,res) => {
  if (req.body.password != "AdminMatcha") {
		res.status(401).json({ message: "Unauthorized 401 : Can't install you need to use the instalation password" });
		// console.log("Unauthorized 401 : Can't install you need to use the instalation password");
		return;
	}
  let query = fs.readFileSync('./databaseMatcha.sql', 'utf8');
  query = query.trim();
  query = query.split(';');

  // console.log(query);
  query.forEach(async (x, index) => {
      if (x !== undefined && x.length > 0)
        await connection.query(x);
  })
  //connection.query(query);
	res.status(200).json({ message: 'Install Database SUCCESS' });
}

exports.addSeed = (req,res) => {
  if (req.body.password != "AdminMatcha") {
		res.status(401).json({ message: "Unauthorized 401 : Can't install you need to use the instalation password" });
		// console.log("Unauthorized 401 : Can't install you need to use the instalation password");
		return;
  }
  if (req.body.seed === "1") {
		connection.query('DELETE FROM users');
    connection.query('ALTER TABLE users AUTO_INCREMENT =0');
    let query = fs.readFileSync('./1000users.sql', 'utf8');
    query = query.trim();
    query = query.split('|');

    //console.log(query);
    query.forEach(async (x) => {
        if (x !== undefined && x.length > 0)
          await connection.query(x);
    })
    //connection.query(query);
    res.status(200).json({ message: 'add seed 1 SUCCESS' });
  } else if (req.body.seed === "2") {
    connection.query('DELETE FROM users');
    connection.query('ALTER TABLE users AUTO_INCREMENT =0');
    let query = fs.readFileSync('./48users.sql', 'utf8');
    query = query.trim();
    query = query.split('|');

    //console.log(query);
    query.forEach(async (x) => {
        if (x !== undefined && x.length > 0)
          await connection.query(x);
    })
    //connection.query(query);
	  res.status(200).json({ message: 'add seed 2 SUCCESS' });
  } else {
    res.status(400).json({ message: 'wrong parameters' });
  }
}
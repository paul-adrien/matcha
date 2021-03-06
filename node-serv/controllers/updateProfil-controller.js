var connection = require("./../config/db");

exports.updateProfil = (req, res) => {
  if (
    req.body.userName &&
    req.body.email &&
    req.body.lastName &&
    req.body.firstName &&
    req.body.bio &&
    req.body.birthDate &&
    req.body.showMe &&
    (req.body.profileComplete || req.body.profileComplete === false) &&
    req.body.saveEmail &&
    req.body.gender
  ) {
    connection.query(
      "UPDATE users SET lastName = ?, firstName = ?, email = ?, userName = ?, gender = ?, bio = ?, birthDate = ?, showMe = ?, profileComplete = ? WHERE email = ?",
      [
        req.body.lastName,
        req.body.firstName,
        req.body.email,
        req.body.userName,
        req.body.gender,
        req.body.bio,
        req.body.birthDate,
        req.body.showMe,
        req.body.profileComplete,
        req.body.saveEmail,
      ],
      function (error, results, fields) {
        if (error) {
          res.json({
            error: error,
            status: false,
            message: "there are some error with query update profil",
          });
        } else {
          connection.query(
            "SELECT * FROM users WHERE email = ?",
            [req.body.email],
            function (error, results, fields) {
              if (error) {
                res.json({
                  status: false,
                  message: "there are some error with query select email",
                });
              } else {
                if (results.length > 0) {
                  res.json({
                    status: true,
                    message: "profil was update",
                    user: results[0],
                  });
                } else {
                  res.json({
                    status: false,
                    message: "update failed",
                  });
                }
              }
            }
          );
        }
      }
    );
  } else {
    res.json({
      status: false,
      message: "wrong data input",
    });
  }
};

exports.uploadPicture = (req, res) => {
  if (req.body.picture && req.body.email) {
    connection.query(
      `UPDATE users SET ${req.body.picture.id} = ? WHERE email = ?`,
      [req.body.picture.url, req.body.email],
      function (error, results, fields) {
        if (error) {
          res.json({
            error: error,
            status: false,
            message: "there are some error with query update profil",
          });
        } else {
          connection.query(
            "SELECT * FROM users WHERE email = ?",
            [req.body.email],
            function (error, results, fields) {
              if (error) {
                res.json({
                  status: false,
                  message: "there are some error with query select email",
                });
              } else {
                if (results.length > 0) {
                  res.json({
                    status: true,
                    message: "profil was update",
                    user: results[0],
                  });
                } else {
                  res.json({
                    status: false,
                    message: "update failed",
                  });
                }
              }
            }
          );
        }
      }
    );
  } else {
    res.json({
      status: false,
      message: "wrong data input",
    });
  }
};

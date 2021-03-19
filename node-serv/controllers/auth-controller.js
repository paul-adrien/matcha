var connection = require("./../config/db");
const bcrypt = require("bcrypt");
const config = require("../config/jwt.json");
const jwt = require("jsonwebtoken");
const saltRounds = 10;
var nodemailer = require("nodemailer");

async function getUser(id) {
  return new Promise(resultat =>
    connection.query("SELECT * FROM users WHERE id = ?", [id], function (error, results, fields) {
      if (error) {
        resultat(null);
      } else {
        if (results && results.length > 0) {
          resultat(results[0]);
        } else {
          resultat(null);
        }
      }
    })
  );
}

exports.register = (req, res) => {
  if (
    req.body.userName &&
    req.body.lastName &&
    req.body.email &&
    req.body.password &&
    req.body.firstName
  ) {
    connection.query(
      "SELECT * FROM users WHERE userName = ?",
      [req.body.userName],
      function (error, results, fields) {
        if (error) {
          res.json({
            status: false,
            message: "there are some error with query select username",
          });
        } else {
          if (results.length > 0) {
            res.json({
              status: false,
              message: "Ce nom d'utilisateur est déjà utilisé",
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
                      status: false,
                      message: "Cette email est déjà utilisé",
                    });
                  } else {
                    bcrypt.genSalt(saltRounds, function (err, salt) {
                      bcrypt.hash(req.body.password, salt, function (err, hash) {
                        var rand = Math.floor(Math.random() * 100 + 54);
                        connection.query(
                          "INSERT INTO users (email, password, userName, lastName, firstName, emailVerify, profileComplete, link, nbLikes) VALUES (?, ?, ?, ?, ?, 0, 0, ?, 0)",
                          [
                            req.body.email,
                            hash,
                            req.body.userName,
                            req.body.lastName,
                            req.body.firstName,
                            rand,
                          ],
                          function (error, results, fields) {
                            if (error) {
                              res.json({
                                status: false,
                                message: "there are some error with query insert new user",
                                error: error,
                                user: req.body,
                              });
                            } else {
                              connection.query(
                                "SELECT * FROM users WHERE userName = ?",
                                [req.body.userName],
                                function (error, results, fields) {
                                  var link = "http://localhost:8081/verify/" + rand;
                                  var transporter = nodemailer.createTransport({
                                    service: "gmail",
                                    auth: {
                                      user: "42.noreplymatcha@gmail.com",
                                      pass: "GguyotPlaurent76",
                                    },
                                  });

                                  var mailOptions = {
                                    from: "42.noreplymatcha@gmail.com",
                                    to: req.body.email,
                                    subject: "Please confirm your Email account",
                                    html:
                                      "Hello,<br> Please Click on the link to verify your email.<br><a href=" +
                                      link +
                                      ">Click here to verify</a>",
                                  };

                                  transporter.sendMail(mailOptions, function (error, info) {
                                    if (error) {} else {}
                                  });

                                  const token = jwt.sign({ id: results[0]["id"] }, config.secret, {
                                    expiresIn: "1d",
                                  });
                                  res.json({
                                    status: true,
                                    message: "user registered sucessfully",
                                    user: results[0],
                                    token: token,
                                  });
                                }
                              );
                            }
                          }
                        );
                      });
                    });
                  }
                }
              }
            );
          }
        }
      }
    );
  } else {
    res.json({
      status: false,
      message: "Veuillez réessayer",
    });
  }
};

exports.authenticate = (req, res) => {
  var userName = req.body.userName;
  var password = req.body.password;

  if (userName && password) {
    connection.query(
      "SELECT * FROM users WHERE userName = ?",
      [userName],
      function (error, results, fields) {
        if (error) {
          res.json({
            status: false,
            message: "Veuillez réessayer",
          });
        } else {
          if (results.length > 0) {
            bcrypt.compare(password, results[0]["password"], function (err, result) {
              if (result == true) {
                const token = jwt.sign({ id: results[0]["id"] }, config.secret, {
                  expiresIn: "1d",
                });
                res.json({
                  status: true,
                  message: "successfully authenticated",
                  user: results[0],
                  token: token,
                });
              } else {
                res.json({
                  status: false,
                  message:
                    "Mot de passe invalide",
                });
              }
            });
          } else {
            res.json({
              status: false,
              message: "Ce nom d'utilisateur n'existe pas",
            });
          }
        }
      }
    );
  } else {
    res.json({
      status: false,
      message: "Veuillez réessayer",
    });
  }
};

exports.verifyEmail = (req, res) => {
  var email = req.body.email;
  var id = req.body.id;

  if (email && id) {
    connection.query(
      "SELECT link FROM users WHERE email = ?",
      email,
      function (error, results, fields) {
        if (error) {
          res.json({
            status: false,
            message: "there are some error with query",
          });
        } else {
          if (results.length > 0) {
            if (id == results[0]["link"]) {
              connection.query(
                "UPDATE users SET emailVerify = 1 WHERE email = ?",
                req.body.email,
                function (error, results, fields) {
                  if (error) {
                    res.json({
                      status: false,
                      message: "there are some error with query update",
                    });
                  } else {
                    res.json({
                      status: true,
                      message: "successfully validating email",
                    });
                  }
                }
              );
            }
          } else {
            res.json({
              status: false,
              message: "Email does not exits",
            });
          }
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

exports.forgotPass_send = (req, res) => {
  var email = req.body.email;

  if (email) {
    connection.query(
      "SELECT * FROM users WHERE email = ?",
      email,
      function (error, results, fields) {
        if (error) {
          res.json({
            status: false,
            message: "there are some error with query",
          });
        } else {
          if (results.length > 0) {
            var rand = Math.floor(Math.random() * 100 + 54);
            var link = "http://localhost:8081/forgotPass/" + rand;
            var transporter = nodemailer.createTransport({
              service: "gmail",
              auth: {
                user: "42.noreplymatcha@gmail.com",
                pass: "GguyotPlaurent76",
              },
            });

            var mailOptions = {
              from: "42.noreplymatcha@gmail.com",
              to: email,
              subject: "Please confirm your Email account",
              html:
                "Hello,<br> Please Click on the link to reset your password.<br><a href=" +
                link +
                ">Click here to verify</a>",
            };

            transporter.sendMail(mailOptions, function (error, info) {
              if (error) {
              } else {}
            });
            connection.query(
              "UPDATE users SET link = ? WHERE email = ?",
              [rand, req.body.email],
              function (error, results, fields) {
                if (error) {
                  res.json({
                    status: false,
                    message: "there are some error with query update",
                  });
                } else {
                  res.json({
                    status: true,
                    message: "successfully sending email",
                  });
                }
              }
            );
          } else {
            res.json({
              status: false,
              message: "Username does not exits",
            });
          }
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

exports.verifyEmail_send = async (req, res) => {
  var id = req.body.id;

  let user = await getUser(id);
  if (user !== null) {
    var rand = Math.floor(Math.random() * 100 + 54);

    var link = "http://localhost:8081/verify/" + rand;
    var transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "42.noreplymatcha@gmail.com",
        pass: "GguyotPlaurent76",
      },
    });

    var mailOptions = {
      from: "42.noreplymatcha@gmail.com",
      to: req.body.email,
      subject: "Please confirm your Email account",
      html:
        "Hello,<br> Please Click on the link to verify your email.<br><a href=" +
        link +
        ">Click here to verify</a>",
    };

    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {} else {
        res.json({
          status: true,
          message: "mail sended sucessfully",
        });
      }
    });
    connection.query(
      "UPDATE users SET link = ? WHERE id = ?",
      [rand, id],
      function (error, results, fields) {
        if (error) {
          res.json({
            status: false,
            message: "there are some error with query update",
          });
        } else {
          res.json({
            status: true,
            message: "successfully sending email",
          });
        }
      }
    );
  }
};

exports.forgotPass_change = (req, res) => {
  var email = req.body.email;
  var password = req.body.password;
  var id = req.body.id;

  if (password && id) {
    connection.query(
      "SELECT * FROM users WHERE email = ?",
      email,
      function (error, results, fields) {
        if (error) {
          res.json({
            status: false,
            message: "there are some error with query",
          });
        } else {
          if (results.length > 0) {
            if (id == results[0]["link"]) {
              bcrypt.genSalt(saltRounds, function (err, salt) {
                bcrypt.hash(password, salt, function (err, hash) {
                  connection.query(
                    "UPDATE users SET password = ? WHERE email = ?",
                    [hash, email],
                    function (error, results, fields) {
                      if (error) {
                        res.json({
                          status: false,
                          message: "there are some error with query update password",
                        });
                      } else {
                        res.json({
                          status: true,
                          data: results,
                          message: "Password was changed",
                        });
                      }
                    }
                  );
                });
              });
            } else {
              res.json({
                status: false,
                message: "wrong email",
              });
            }
          } else {
            res.json({
              status: false,
              message: "Email does not exits",
            });
          }
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

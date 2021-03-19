var express = require("express");
var session = require("express-session");
var bodyParser = require("body-parser");
var path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");

var app = express();

var corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

// use JWT auth to secure the api

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Headers", "x-access-token, Origin, Content-Type, Accept");
  next();
});

var connection = require("./config/db");

var authController = require("./controllers/auth-controller");
var verifyTokenController = require("./controllers/verifyToken-controller");
var updateProfilController = require("./controllers/updateProfil-controller");
var tagsController = require("./controllers/tags-controller");
var userController = require("./controllers/user-controller");
var likeController = require("./controllers/like-controller");
var matchController = require("./controllers/match-controller");
var messagingController = require("./controllers/messaging-controller");
var dbController = require("./controllers/db-controller");

async function calcScore() {
  users = connection.query("SELECT * FROM users", [], async function (error, results, fields) {
    if (error) {} else {
      if (results && results.length > 0) {
        await Promise.all(
          results.map(async function (user) {
            let scoreViews = 0
            if (user != null) {
              if (user.nbViews >= 1000) {
                scoreViews = 50;
              } else {
                scoreViews = (((user.nbViews) / 1000) * 100) / 2;
              }
              if (user.nbLikes >= user.nbViews && (user.nbLikes != 0 && user.nbViews != 0)) {
                user.score = Math.round(scoreViews + 50);
              } else if (user.nbLikes != 0 && user.nbViews != 0) {
                user.score = Math.round(
                  scoreViews + (100 + ((user.nbLikes - user.nbViews) / user.nbViews) * 100) / 2
                );
              } else {
                user.score = Math.round(
                  scoreViews + 0
                );
              }
              connection.query(
                "UPDATE users SET score = ? WHERE id = ?",
                [user.score, user.id],
                function (error, results, fields) {
                  if (error) {
                  } else {
                  }
                }
              );
            }
          })
        );
      } else {}
    }
  });
}

setInterval(calcScore, 60000 );

app.get("/", (req, res) => {
  res.json({ message: "Welcome to Gguyot and Plaurent NodeJS Mysql server." });
});

/* route to handle login and registration */
app.post("/api/register", authController.register);
app.post("/api/authenticate", authController.authenticate);
app.post("/api/verify", authController.verifyEmail);
app.post("/api/resend-verify", authController.verifyEmail_send);
app.post("/api/forgotPass_s", authController.forgotPass_send);
app.post("/api/forgotPass_c", authController.forgotPass_change);
app.post("/api/verifyToken", verifyTokenController.verifyToken);
app.post("/api/updateProfil", updateProfilController.updateProfil);
app.post("/api/uploadPicture", updateProfilController.uploadPicture);
app.get("/api/users/:id/history", userController.getHistory);
app.post("/api/whoLikeMe", likeController.whoLikeMe);
app.get("/api/users/:id", userController.getUser);
app.get("/api/users/:userId/likeOrNot/:likeId", likeController.likeOrNot);
app.post("/api/like", likeController.likeOrDislike);
app.get("/api/getAllTags", tagsController.getAllTags);
app.get("/api/getYourTags/:id", tagsController.getYourTags);
app.post("/api/addExistTag", tagsController.addExistTag);
app.post("/api/addNonExistTag", tagsController.addNonExistTag);
app.post("/api/deleteTag", tagsController.deleteTag);
app.get("/api/users/:id/getSuggestion", matchController.getSuggestion);
app.get(
  "/api/users/:id/min-age/:minAge/max-age/:maxAge/score/:score/tags/:tags/distance/:dist/sort-by/:sortBy",
  matchController.filtreUsersBy
);
app.post("/api/user/:id/update-position", userController.updatePosition);
app.post("/api/user/:id/viewedProfil", userController.viewedProfil);
//messaging
app.get("/api/possiblyConv/:id", messagingController.possiblyConv);
app.get("/api/activeConv/:id", messagingController.activeConv);
app.get("/api/getMessage/:id", messagingController.getMessage);
app.post("/api/sendMessage", messagingController.sendMessage);
app.get("/api/users/:id/getNotifs", userController.getNotifs);
app.get("/api/users/:id/seeNotifs", userController.seeNotifs);
app.post("/api/seeMsgNotif", messagingController.seeMsgNotif);

app.post("/api/reportUser", userController.reportUser);
app.post("/api/blockUser", userController.blockUser);

app.post("/api/install/db", dbController.installDb);
app.post("/api/addSeed", dbController.addSeed);

app.use("*", (req, res, next) => {
  return res.status(404).send();
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  //console.log(`Server is running on port ${PORT}.`);
});

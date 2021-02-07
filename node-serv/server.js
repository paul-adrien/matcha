var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const cors = require("cors");
const cookieParser = require("cookie-parser");

var app = express();

var corsOptions = {
	origin: "http://localhost:8081"
};
  
app.use(cors(corsOptions));

// use JWT auth to secure the api

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.use(cookieParser())

app.use(function(req, res, next) {
	res.header(
	  "Access-Control-Allow-Headers",
	  "x-access-token, Origin, Content-Type, Accept"
	);
	next();
});

var connection = require('./config/db');

var authController = require('./controllers/auth-controller');
var verifyTokenController = require('./controllers/verifyToken-controller');
var updateProfilController = require('./controllers/updateProfil-controller');
var tagsController = require('./controllers/tags-controller');
var userController = require('./controllers/user-controller');
var likeController = require('./controllers/like-controller');
var matchController = require('./controllers/match-controller');

async function calcScore() {
	users = connection.query('SELECT * FROM users',[], async function (error, results, fields) {
        if (error) {
			console.log('error get users');
        } else {
            if(results && results.length > 0){
				await Promise.all(results.map(async function(user) {
					if (user != null) {
						if (user.nbViews >= 1000){
							scoreViews = 50;
						} else {
							scoreViews = (100 + (((user.nbViews - 1000) / 1000) * 100)) / 2;
						}
						if (user.nbLikes >= user.nbViews) {
							user.score = Math.round(scoreViews + 50);
						} else {
							user.score = Math.round(scoreViews + ((100 + ((user.nbLikes - user.nbViews) / user.nbViews)) / 2));
						}
						console.log(user.score);
						connection.query('UPDATE users SET score = ? WHERE id = ?',[user.score, user.id], function (error, results, fields) {
							if (error) {
								console.log('error update score');
							} else {
								console.log('update score');
							}
						})
					}
				}));
			} else {
				console.log('error get users');
			}
        }
	});
}

setInterval(calcScore, 30000);

app.get("/", (req, res) => {
	res.json({ message: "Welcome to plaurent NodeJS Mysql server." });
});

/* route to handle login and registration */
app.post('/api/register', authController.register);
app.post('/api/authenticate', authController.authenticate);
app.post('/api/verify', authController.verifyEmail);
app.post('/api/forgotPass_s', authController.forgotPass_send);
app.post('/api/forgotPass_c', authController.forgotPass_change);
app.post('/api/verifyToken', verifyTokenController.verifyToken);
app.post('/api/updateProfil', updateProfilController.updateProfil);
app.post('/api/uploadPicture', updateProfilController.uploadPicture);
app.post('/api/takeViewProfil', userController.takeViewProfil);
app.post('/api/whoLikeMe', likeController.whoLikeMe);
app.post('/api/getUser', userController.getUser);
app.post('/api/likeOrNot', likeController.likeOrNot);
app.post('/api/like', likeController.likeOrDislike);
app.get('/api/getAllTags', tagsController.getAllTags);
app.get('/api/getYourTags/:id', tagsController.getYourTags);
app.post('/api/addExistTag', tagsController.addExistTag);
app.post('/api/addNonExistTag', tagsController.addNonExistTag);
app.post('/api/deleteTag', tagsController.deleteTag);
app.post('/api/getSuggestion', matchController.getSuggestion);
app.post('/api/sortUsersBy', matchController.sortUsersBy);
app.post('/api/filtreUsersBy', matchController.filtreUsersBy);
app.post('/api/user/:id/update-position', userController.updatePosition);


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


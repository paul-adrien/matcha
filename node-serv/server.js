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
app.post('/api/like', likeController.likeOrDislike);
app.post('/api/getAllTags', tagsController.getAllTags);
app.post('/api/getYourTags/:id', tagsController.getYourTags);
app.post('/api/addExistTag', tagsController.addExistTag);
app.post('/api/addNonExistTag', tagsController.addNonExistTag);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


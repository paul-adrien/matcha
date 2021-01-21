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

var authenticateController = require('./controllers/authenticate-controller');
var registerController = require('./controllers/register-controller');
var verifyController = require('./controllers/verify-controller');
var forgotPassController = require('./controllers/forgotPass-controller');
var verifyTokenController = require('./controllers/verifyToken-controller');
var updateProfilController = require('./controllers/updateProfil-controller');
var tagsController = require('./controllers/tags-controller');

app.get("/", (req, res) => {
	res.json({ message: "Welcome to plaurent NodeJS Mysql server." });
});

/* route to handle login and registration */
app.post('/api/register', registerController.register);
app.post('/api/authenticate', authenticateController.authenticate);
app.post('/api/verify', verifyController.verify);
app.post('/api/forgotPass_s', forgotPassController.forgotPass_send);
app.post('/api/forgotPass_c', forgotPassController.forgotPass_change);
app.post('/api/verifyToken', verifyTokenController.verifyToken);
app.post('/api/updateProfil', updateProfilController.updateProfil);
app.post('/api/addTag', tagsController.addTag);
app.post('/api/takeTags', tagsController.seeTag);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


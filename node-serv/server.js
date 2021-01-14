var express = require('express');
var session = require('express-session');
var bodyParser = require('body-parser');
var path = require('path');
const cors = require("cors");

var app = express();

var corsOptions = {
	origin: "http://localhost:8081"
};
  
app.use(cors(corsOptions));

app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());

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

app.get("/", (req, res) => {
	res.json({ message: "Welcome to plaurent NodeJS Mysql server." });
});

/* route to handle login and registration */
app.post('/api/register', registerController.register);
app.post('/api/authenticate', authenticateController.authenticate);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});


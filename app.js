var express 		= require("express");
var bodyParser 		= require("body-parser");
var path 			= require('path');

var port = process.env.PORT || 3000; 	//set our port

//Require routes config
var routesAPI = require('./app_api/config/routes.js')

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'app_client')));

// [SH] Use the API routes when path starts with /api
app.use('/', routesAPI);
app.use(function(req, res) {
    res.sendFile(__dirname + '/app_client/index.html');
});

app.listen(port);
console.log('Flying on port: ' + port);

module.exports = app;
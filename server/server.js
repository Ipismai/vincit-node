/**
 * Main application file
 */

'use strict';

// Dependency definitions.
var express = require('express');
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var config = require('./config');

var api = require('./api');

// Connect to database
mongoose.connect(config.mongo.dbpath + ':' + config.mongo.dbport +
                 '/' + config.mongo.dbname);

// Configuring the server.
var app = express();
app.use(bodyParser.json());
app.use('/api', api);
// Serving the client files as static.
app.use(express.static(__dirname + '/../client'));

// Starting the server.
var server = app.listen(config.serverPort, function () {
    var host = server.address().address;
    var port = server.address().port;
    
    console.log('Server started on address %s listening on port %s', host, port);
});

module.exports = app;
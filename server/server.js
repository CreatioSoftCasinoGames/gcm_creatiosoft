'use strict';

var express = require('express'),
    Db = require('./config/db'),
    config = require('./config/config');

require('./model/leaderboard');
require('./model/top10player');

var bodyParser = require('body-parser');

var app = express();

app.use(bodyParser());

require('./routes')(app);

var port = config.server.port;

app.listen(port, function (argument) {
	console.log('Express app started on port ' + port);
	
});



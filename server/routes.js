'use strict';

// Load modules

var leaderboard      = require('./controller/leaderboard');

// API Server Endpoints
module.exports = function(app){

	app.route('/registerScore')
	   .post(leaderboard.create)

    app.route('/getTopScores/:level')
       .get(leaderboard.getByLevel);
}

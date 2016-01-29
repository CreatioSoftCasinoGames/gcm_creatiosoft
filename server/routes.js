'use strict';

// Load modules

var leaderboard      = require('./controller/leaderboard'),
	top10player      = require('./controller/top10player'),
	user      		 = require('./controller/user');

// API Server Endpoints
module.exports = function(app){

	app.route('/leaderboard')
	   .post(leaderboard.create)
       .get(leaderboard.getAll);

    app.route('/top10player')
	   .post(top10player.create)
       .get(top10player.getAll);

    app.route('/user')
	   .post(user.createUser)
       .get(user.getAllUser);
}

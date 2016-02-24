'use strict';

// Load modules

var bingoAdd      = require('./controller/bingoAdd');

// API Server Endpoints
module.exports = function(app){


    app.route('/bingoAdd/:paidType')
		.post(bingoAdd.create)
       	.get(bingoAdd.getByType);
}

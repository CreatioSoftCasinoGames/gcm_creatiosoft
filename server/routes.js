'use strict';

// Load modules

var bingoAdd  = require('./controller/bingoAdd'),
	iapBundle = require('./controller/iapBundle');

// API Server Endpoints
module.exports = function(app){

    app.route('/bingoAdd/:paidType')
		.post(bingoAdd.create)
       	.get(bingoAdd.getByType);

	app.route('/iapBundle/:level')
       	.get(iapBundle.getByLevel);

    app.route('/iapBundle')
    	.get(iapBundle.getAlliap)
       	.post(iapBundle.createIapBundle);

    app.route('/iapBundleByTime/:level/:type')
       	.get(iapBundle.getByLevelAndTime);
}

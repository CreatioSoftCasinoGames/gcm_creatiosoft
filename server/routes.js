'use strict';

// Load modules

var bingoAdd  = require('./controller/bingoAdd'),
	iapBundle = require('./controller/iapBundle');

// API Server Endpoints
module.exports = function(app){

    app.route('/bingoAdd/:paidType')
		    .post(bingoAdd.create)
       	.get(bingoAdd.getByType);

    app.route('/iapBundle')
       	.post(iapBundle.createIapBundle);

    app.route('/iapBundle/:type')
    	.get(iapBundle.getAlliapByType);

      app.route('/iapBundle/update/:bundleId')
      .put(iapBundle.updateIapBundle);

    app.route('/iapBundleByTime/:level/:type')
       	.get(iapBundle.getByLevelAndTime);
}

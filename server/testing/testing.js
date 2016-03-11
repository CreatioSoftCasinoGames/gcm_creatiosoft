	var request = require('superagent');
    var assert = require('assert');
    var db =require('./../config/db').db;
    var testData = require('./testData');
    var base_url = "http://localhost:4000/";
    
  	beforeEach(function(done){
  		db.collection('iapbundles').remove();
  		done();	
  	});

  describe("Test cases", function() {


		it("Test case for create iap bundle i.e data is insert.", function(done) {
	      request
	      .post(base_url+"iapBundle")
	      .accept('application/json')
	      .send(testData.dataForTrueEntry)
	      .end(function(error, response) {
	      	assert.strictEqual(true, response.body.status);
	      	 request.get(base_url+"iapBundle")
	      	 .accept('application/json')
	      	 .end(function(error, response) {
	      		assert.strictEqual(true, response.body.status);
	        	done();
	      	});
	      });
	    });

		it("Test case when Packtype is entered empty.", function(done) {
	      request
	      .post(base_url+"iapBundle")
	      .accept('application/json')
	      .send(testData.dataForEmptyPackType)
	      .end(function(error, response) {
	      	// console.log(response.body);
	      	assert.strictEqual(false, response.body.status, "Expecting False as Packtype is entered empty.");
	        done();
	      });
	    });

	    it("Test case when level start is greater than level end.", function(done) {
	      request
	      .post(base_url+"iapBundle")
	      .accept('application/json')
	      .send(testData.dataForLevelValidation)
	      .end(function(error, response) {
	      	// console.log(response);
	      	assert.strictEqual(false, response.body.status, "Expecting False as end level is greater than start level");
	        done();
	      });
	    });

	    it("Test case when start level is entered null.", function(done) {
	      request
	      .post(base_url+"iapBundle")
	      .accept('application/json')
	      .send(testData.dataForEmptyStartLevel)
	      .end(function(error, response) {
	      	// console.log(response.body);
	      	assert.strictEqual(false, response.body.status, "Expecting False as start level is entered null.");
	        done();
	      });
	    });

	    it("Test case when end level is entered undefined.", function(done) {
	      request
	      .post(base_url+"iapBundle")
	      .accept('application/json')
	      .send(testData.dataForEmptyEndLevel)
	      .end(function(error, response) {
	      	// console.log(response.body);
	      	assert.strictEqual(false, response.body.status, "Expecting False as end level is entered undefined.");
	        done();
	      });
	    });

	    it("Test case when level start format is entered string.", function(done) {
	      request
	      .post(base_url+"iapBundle")
	      .accept('application/json')
	      .send(testData.dataForLevelStartFormat)
	      .end(function(error, response) {
	      	// console.log(response);
	      	assert.strictEqual(false, response.body.status, "Expecting False as level start format is entered string");
	        done();
	      });
	    });

	     it("Test case when level end format is entered string.", function(done) {
	      request
	      .post(base_url+"iapBundle")
	      .accept('application/json')
	      .send(testData.dataForLevelEndFormat)
	      .end(function(error, response) {
	      	// console.log(response);
	      	assert.strictEqual(false, response.body.status, "Expecting False as level end format is entered string");
	        done();
	      });
	    });

		it("Test case when Packname is entered null.", function(done) {
	      request
	      .post(base_url+"iapBundle")
	      .accept('application/json')
	      .send(testData.dataForEmptyPackName)
	      .end(function(error, response) {
	      	// console.log(response.body);
	      	assert.strictEqual(false, response.body.status, "Expecting False as Packname is entered null.");
	        done();
	      });
	    });

		it("Test case when Original Price format is entered string.", function(done) {
	      request
	      .post(base_url+"iapBundle")
	      .accept('application/json')
	      .send(testData.dataForOriginalPriceFormat)
	      .end(function(error, response) {
	      	// console.log(response);
	      	assert.strictEqual(false, response.body.status, "Expecting False as Original Price format is entered string");
	        done();
	      });
	    });


	    it("Test case when Original Price is not entered.", function(done) {
	      request
	      .post(base_url+"iapBundle")
	      .accept('application/json')
	      .send(testData.dataForEmptyOriginalPrice)
	      .end(function(error, response) {
	      	// console.log(response.body);
	      	assert.strictEqual(false, response.body.status, "Expecting False as Original Price is not entered.");
	        done();
	      });
	    });

	    it("Test case when New Price is entered undefined.", function(done) {
	      request
	      .post(base_url+"iapBundle")
	      .accept('application/json')
	      .send(testData.dataForEmptyNewPrice)
	      .end(function(error, response) {
	      	// console.log(response.body);
	      	assert.strictEqual(false, response.body.status, "Expecting False as New Price is entered undefined.");
	        done();
	      });
	    });

	    it("Test case when New Price format is entered string.", function(done) {
	      request
	      .post(base_url+"iapBundle")
	      .accept('application/json')
	      .send(testData.dataForNewPriceFormat)
	      .end(function(error, response) {
	      	// console.log(response);
	      	assert.strictEqual(false, response.body.status, "Expecting False as New Price format is entered string");
	        done();
	      });
	    });

 		it("Test case when SkuID is entered null.", function(done) {
	      request
	      .post(base_url+"iapBundle")
	      .accept('application/json')
	      .send(testData.dataForEmptySkuID)
	      .end(function(error, response) {
	      	// console.log(response.body);
	      	assert.strictEqual(false, response.body.status, "Expecting False as SkuID is entered null.");
	        done();
	      });
	    });

 		it("Test case when date start time is greater than date end time. ", function(done) {
	      request
	      .post(base_url+"iapBundle")
	      .accept('application/json')
	      .send(testData.dataForDateValidation)
	      .end(function(error, response) {
	      	// console.log(response);
	      	assert.strictEqual(false, response.body.status, "Expecting False as end date is greater than start date");
	        done();
	      });
	    });

	    it("Test case when Start Date is not entered.", function(done) {
	      request
	      .post(base_url+"iapBundle")
	      .accept('application/json')
	      .send(testData.dataForEmptyStartDate)
	      .end(function(error, response) {
	      	// console.log(response.body);
	      	assert.strictEqual(false, response.body.status, "Expecting False as Start Date is not entered.");
	        done();
	      });
	    });

	    it("Test case when Start Date pattern is entered string.", function(done) {
	      request
	      .post(base_url+"iapBundle")
	      .accept('application/json')
	      .send(testData.dataForStartDateFormat)
	      .end(function(error, response) {
	      	// console.log(response);
	      	assert.strictEqual(false, response.body.status, "Expecting False as Start Date pattern is entered string.");
	        done();
	      });
	    });

	    it("Test case when End Date pattern is entered string.", function(done) {
	      request
	      .post(base_url+"iapBundle")
	      .accept('application/json')
	      .send(testData.dataForEndDateFormat)
	      .end(function(error, response) {
	      	// console.log(response.body);
	      	assert.strictEqual(false, response.body.status, "Expecting False as End Date pattern is entered string.");
	        done();
	      });
	    });

	    it("Test case when End Date is not entered.", function(done) {
	      request
	      .post(base_url+"iapBundle")
	      .accept('application/json')
	      .send(testData.dataForEmptyEndDate)
	      .end(function(error, response) {
	      	// console.log(response.body);
	      	assert.strictEqual(false, response.body.status, "Expecting False as End Date is not entered.");
	        done();
	      });
	    });
	   
	    it("Test case when Purchase Limit format is entered string.", function(done) {
	      request
	      .post(base_url+"iapBundle")
	      .accept('application/json')
	      .send(testData.dataForPurchaseLimitFormat)
	      .end(function(error, response) {
	      	// console.log(response);
	      	assert.strictEqual(false, response.body.status, "Expecting False as Purchase Limit format is entered string");
	        done();
	      });
	    });

	    it("Test case when Purchase Limit is not entered.", function(done) {
	      request
	      .post(base_url+"iapBundle")
	      .accept('application/json')
	      .send(testData.dataForEmptyPurchaseLimit)
	      .end(function(error, response) {
	      	// console.log(response.body);
	      	assert.strictEqual(false, response.body.status, "Expecting False as Purchase Limit is not entered.");
	        done();
	      });
	    });

	    it("Test case when Discount percent format is entered string.", function(done) {
	      request
	      .post(base_url+"iapBundle")
	      .accept('application/json')
	      .send(testData.dataForDiscountFormat)
	      .end(function(error, response) {
	      	// console.log(response);
	      	assert.strictEqual(false, response.body.status, "Expecting False as Discount percent format is entered string");
	        done();
	      });
	    });

	    it("Test case when Discount percent is not entered.", function(done) {
	      request
	      .post(base_url+"iapBundle")
	      .accept('application/json')
	      .send(testData.dataForEmptyDiscount)
	      .end(function(error, response) {
	      	// console.log(response.body);
	      	assert.strictEqual(false, response.body.status, "Expecting False as Discount percent is not entered.");
	        done();
	      });
	    });

	    it("Test case when wheelSpins format is entered string.", function(done) {
	      request
	      .post(base_url+"iapBundle")
	      .accept('application/json')
	      .send(testData.dataForWheelSpinsFormat)
	      .end(function(error, response) {
	      	// console.log(response);
	      	assert.strictEqual(false, response.body.status, "Expecting False as  wheelSpins format is entered string");
	        done();
	      });
	    });

	    it("Test case when Keys format is entered string.", function(done) {
	      request
	      .post(base_url+"iapBundle")
	      .accept('application/json')
	      .send(testData.dataForkeysFormat)
	      .end(function(error, response) {
	      	// console.log(response);
	      	assert.strictEqual(false, response.body.status, "Expecting False as Keys format is entered string");
	        done();
	      });
	    });

	    it("Test case when Coins format is entered string.", function(done) {
	      request
	      .post(base_url+"iapBundle")
	      .accept('application/json')
	      .send(testData.dataForCoinsFormat)
	      .end(function(error, response) {
	      	// console.log(response);
	      	assert.strictEqual(false, response.body.status, "Expecting False as Coins format is entered string");
	        done();
	      });
	    });

	    it("Test case when tickets format is entered string.", function(done) {
	      request
	      .post(base_url+"iapBundle")
	      .accept('application/json')
	      .send(testData.dataForTicketsFormat)
	      .end(function(error, response) {
	      	// console.log(response);
	      	assert.strictEqual(false, response.body.status, "Expecting False as tickets format is entered string.");
	        done();
	      });
	    });

	    it("Test case when Scratchers format is entered string.", function(done) {
	      request
	      .post(base_url+"iapBundle")
	      .accept('application/json')
	      .send(testData.dataForScratchersFormat)
	      .end(function(error, response) {
	      	// console.log(response);
	      	assert.strictEqual(false, response.body.status, "Expecting False as Scratchers format is entered string.");
	        done();
	      });
	    });

	    it("Test case when Powerups format is entered string.", function(done) {
	      request
	      .post(base_url+"iapBundle")
	      .accept('application/json')
	      .send(testData.dataForPowerUpsFormat)
	      .end(function(error, response) {
	      	// console.log(response.body);
	      	assert.strictEqual(false, response.body.status, "Expecting False as Powerups format is entered string.");
	        done();
	      });
	    });

	    // it("Test case when two items are same in items.", function(done) {
	    //   request
	    //   .post(base_url+"iapBundle")
	    //   .accept('application/json')
	    //   .send(testData.dataForIncorrectItems)
	    //   .end(function(error, response) {
	    //   	console.log(response.body);
	    //   	assert.strictEqual(false, response.body.status, "Expecting False as two items are entered same in items.");
	    //     done();
	    //   });
	    // });

	   
  });

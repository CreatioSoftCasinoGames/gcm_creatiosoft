var TeenPatti = function() {
	this.init();
}

TeenPatti.prototype = {

	init: function() {
		this.registration();
		this.login();
		this.loginTwo();
		this.loginThree();
		this.maintenance();
		this.pomelo = window.pomelo;
		this.host = $("body").data("gate-host");
		this.port = $("body").data("gate-port");
		this.user = null;
	},

	registration: function() {
		var that = this;
		$("#registration").on("submit", function() {
	  	$.post("registerplayer",
	    {
	    playerName:"Amrendra",
        playerEmail : "amrendra@gmail.com",
        playerMobile : "0303030303",
        playerPassword : "1234",
        playerAvatarId : "3"
	    },
	    function(data, status){
        console.log("Data: " + JSON.stringify(data) + "\nStatus: " + status);
        console.log('Host - ' + that.host + ' port - ' + that.port);
        pomelo.init({
			    host: that.host,
			    port: that.port,
			    log: true
				  }, function() {
				  });
	      });
			return false;
		})
	},

	login: function() {
		var that = this;
		$("#login").on("submit", function() {
			console.log(that.host);
			console.log(that.port);
		    pomelo.init({
		    host: that.host,
		    port: that.port,
		    log: true
		    }, function() {
		  	// var route = "gate.gateHandler.queryEntry";
		  	var route = "database.dbHandler.verifyLoginDetail";
		  	var playerId = "V1IDiIODe";
		    pomelo.request(route, {
        		playerId:"V1IDiIODe",
            playerMobile: "0101010101",
            playerPassword: "1234"
		    }, function(data) {
		    	$("#token").text("V1IDiIODe");
					$("#name").text("Govind");
		    	console.log(data);
		    	if(data.status) {
		    		pomelo.disconnect();
						that.connectPomelo(playerId, data.host, data.port);
		    	}
		    });
		  });
			return false;
		})
	},

	loginTwo: function() {
		var that = this;
		$("#loginTwo").on("submit", function() {
			console.log(that.host);
			console.log(that.port);
		    pomelo.init({
		    host: that.host,
		    port: that.port,
		    log: true
		    }, function() {
		  	// var route = "gate.gateHandler.queryEntry";
		  	var route = "database.dbHandler.verifyLoginDetail";
		    pomelo.request(route, {
        	playerId:"E1Z6s8uPe",
            playerMobile: "0202020202",
            playerPassword: "1234"
		    }, function(data) {
		    	console.log(data);
		    	if(data.status) {
		    		$("#token").text("E1Z6s8uPe");
						$("#name").text("Suresh");
		    		pomelo.disconnect();
						that.connectPomelo(data.host, data.port);
		    	}
		    });
		  });
			return false;
		})
	},

	loginThree: function() {
		var that = this;
		$("#loginThree").on("submit", function() {
			console.log(that.host);
			console.log(that.port);
		    pomelo.init({
		    host: that.host,
		    port: that.port,
		    log: true
		    }, function() {
		  	// var route = "gate.gateHandler.queryEntry";
		  	var route = "database.dbHandler.verifyLoginDetail";
		    pomelo.request(route, {
        	playerId:"VJwMn8dPe",
            playerMobile: "0303030303",
            playerPassword: "1234"
		    }, function(data) {
		    	console.log(data);
		    	if(data.status) {
		    		$("#token").text("VJwMn8dPe");
						$("#name").text("Amrendra");
		    		pomelo.disconnect();
						that.connectPomelo(data.host, data.port);
		    	}
		    });
		  });
			return false;
		})
	},


	maintenance: function() {
		var that = this;
		console.log('called');
		$("#maintenance").click(function() {
			console.log('insode ')
			console.log(that.host);
			console.log(that.port);
		    pomelo.init({
		    host: that.host,
		    port: that.port,
		    log: true
		    }, function() {
		  	// var route = "gate.gateHandler.queryEntry";
		  	var route = "connector.entryHandler.maintenance";
		    pomelo.request(route, {}, function(data) {
		    	console.log(data);
		    });
		  });
			return false;
		})
	},

	showPartial: function(partialClass) {
		$(".partial").addClass("hide");
		$(partialClass).removeClass("hide");
	},

    showSubPartial: function(subClass) {
        //$(".partial").addClass("hide");
        $(subClass).removeClass("hide");
    },
    showHeadPartial : function(headerClass){
        $(".header").addClass("hide");
        $(headerClass).removeClass("hide");
    },
    hideHeader : function(){
        $(".header").addClass("hide");
    },

	connectPomelo: function(playerId, host, port) {
		var that = this;
		pomelo.init({
	    host: host,
	    port: port,
	    log: true
	  }, function() {
	  	pomelo.request("database.dbHandler.gameState", function(state){
	  		console.log(state);
	  		pomelo.request("connector.entryHandler.enter", {playerId: playerId}, function(data) {
	  			console.log(data);
		    });
	  	});
	  });
	},

    getEnabledPlayer : function() {
        var that = this;
        alert("I was called !!");
        $("#newregs").on("submit", function() {
            $.post("getnewplayers",
                {
                    adminToken: "testadmintoken"
                },
                function(data, status){
                    console.log("Data: " + JSON.stringify(data) + "\nStatus: " + status);
                    //console.log('Host - ' + that.host + ' port - ' + that.port);

                });
            return false;
        });
    }

}

$(function() {	
	myTeenPatti = new TeenPatti();
});

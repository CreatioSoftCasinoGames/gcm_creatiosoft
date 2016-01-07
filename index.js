
var gcm = require('node-gcm');

var messageData = {
      priority: 'high',
      contentAvailable: true,
      delayWhileIdle: true,
      data: {
        title: "Creatiosoft",         // this will be the title in push sent
        subtitle: "Only for games",   // this will be the subtitle in push sent
        icon: "ic_launcher",
        body: "notification body"
        company: 'Creatiosoft',
        location: 'Noida'
      }
}

// Set up the sender with you API key 

var GoogleServerAPIKey = 'AIzaSyCPnh643pd2rg4Oig7rRhjKK8J7j4SgWTc'; // Google Server API Key

// Add the registration tokens of the devices you want to send to    
//Ex: var registrationTokens = ['APA91bHfadVJSU_uIhHMFBnkYFUGK65JNED0xfmiZ7-h3tufNl1rJNFN3neluWIy9GlesEFbVDyd5IP351pKg64wP0Ik9wU35tbeNV7JdZKf5BsCk3YY19-oavpAv5E1mzc6KbqOykC2'];

var registrationTokens = ['regToken1', 'regToken2'];

sendPush(messageData, GoogleServerAPIKey, registrationTokens);


// This function is responsible to send push notification.
function sendPush(messageData, GoogleServerAPIKey, registrationTokens){

	// Create a message with given value
    var message = new gcm.Message(messageData);

    // Set up the sender with you API key 
    var sender = new gcm.Sender(GoogleServerAPIKey);

    sender.send(message, { registrationTokens: registrationTokens }, function (err, response) {
      if(err) {
        console.log("Error...");
        console.log(err);
      }
      else {
        console.log("Result...");
        console.log(response);
      }
    });
}
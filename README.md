Implement Google Cloud Messaging(GCM) using node-gcm npm
=============================================================================================================

The purpose of this document is to guide the developer to implement Google Cloud Messaging(GCM) to send push notification for android devices.

It code contains the core logic which can be used inside the controller, startup service, etc.

The code is well documented to help understand each line of code written.

You can refer the official node-gcm npm page for latest update [Link] (https://www.npmjs.com/package/node-gcm)

From where you get Google Server API Key?

		You need to create Google Developer Account and generate Google Server API Key

From where you get the registration tokens of the devices you want to send to?

		You will the list logged in DB, which you collected when app get downloaded and installed in device.

Output:

		{
		    "multicast_id": 8380210784764120000,
		    "success": 1,
		    "failure": 0,
		    "canonical_ids": 1,
		    "results": [{
		        "registration_id": "APA91bG042DbL1cHSEs6AoH_rsdTG5JnA0UPFJbUFvVU1bjwDDOFoiE5UqnjFAHD-k16byRL0aC_8f_FlNyyZXMDfyK6r1AfBGt6i0qhnxC1hkgrfDL8GjGWLEV88JaoaHjdg0QIvSi2",
		        "message_id": "0:1451910311815516%f136b13ff9fd7ecd"
		    }]
		}   

You must be puzzled where is the message data in output?

		The message data which you sent is received in android device.

Now it's time to start coding...

Happy Coding!



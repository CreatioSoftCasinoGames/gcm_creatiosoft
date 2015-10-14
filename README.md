Express-Mongoose-Angular Skeleton
================================================

The purpose of this app is to prepare a basic Skeleton for a node.js project and show a new way to work with Express.js, Mongodb, Mongoose, Angular.js.

This gives a quick start for a node.js industrial project without worrying much on structure but focus more on business logic.

It has only basic modules to start a new project from scratch and later add few advance module when needed.

Now it's time to start coding...

Happy Coding!


### Install an app

Run the following command in root directory of an app in command prompt.

###### *Install node packages*

server/ node install

###### *Install bower components*

client/src/ bower install

### Run an app

###### *Run Server*

Run the following command in root directory of an app in command prompt.

server/ node server.js

You can see the port number in command prompt after sucessfull run

You can change the settings in server/config/config.js file

### API

###### *POST request/ Create user*

    http://localhost:8000/user
    
    Body:

    	{
			"userId":"gauravgupta90",
			"username":"gauravgupta",
			"firstname":"Gaurav",
			"fullname":"Gaurav Gupta" // due to virtual function; this field will split by space and will store as firstname and lastname
		}

	Response:

    	{
			"userId":"gauravgupta90",
			"username":"gauravgupta",
			"firstname":"Gaurav",
			"lastname":"Gupta",
			"fullname": "Gaurav Gupta", // due to virtual function; this field nowhere exist in db
			"_id": "561e02e5a464641f0f96f2da" // Mongodb unique id generated by default; it has timestamp of creation
		}


###### *Get request/ Get all users*

    http://localhost:8000/user

    Response:

    	[
			{
				"_id": "561e02bda464641f0f96f2d9",
				"userId": "gauravgupta90",
				"username": "gauravgupta",
				"firstname": "Gaurav",
				"lastname": "Gupta"
				"fullname": "Gaurav Gupta"			
			},
			{
				"_id": "561e02e5a464641f0f96f2da",
				"userId": "gkr",
				"username": "gauravgupta90",
				"firstname": "gaurav",
				"fullname": "gaurav"			
			}
		]

###### *Get request/ Get user by userid*

    http://localhost:8000/user/gauravgupta90

    Respone:

    	{
			"userId":"gauravgupta90",
			"username":"gauravgupta",
			"firstname":"Gaurav",
			"lastname":"Gupta",
			"fullname": "Gaurav Gupta", // due to virtual function; this field nowhere exist in db
			"_id": "561e02e5a464641f0f96f2da" // Mongodb unique id generated by default; it has timestamp of creation
		}

###### *PUT request/ Update user by userid*

	http://localhost:8000/user/gauravgupta90
	
	Body:

    	{
			"username":"gaurav_bng@hotmail.com"
		}

	Response:

		User updated successfully

###### *DELETE request/ Delete user by userid*

	http://localhost:8000/user/gauravgupta90

	Response:

		User deleted successfully
		
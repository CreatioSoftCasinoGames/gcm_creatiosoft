Moral Dielmma
===============================================================


### Install an app

Run the following command in root directory of an app in command prompt.

###### *Install node packages*

server/ npm install

###### *Install bower components*

client/src/ bower install

### Run an app

###### *Run Server*

Run the following command in root directory of an app in command prompt.

server/ node server.js

You can see the port number in command prompt after sucessfull run

You can change the settings in server/config/config.js file

Sql Create Table

		CREATE SCHEMA `moralDilemma` ;

		CREATE TABLE moralDilemma.questions
		(
		Question_Id int NOT NULL AUTO_INCREMENT,
		Question_String varchar(255) NOT NULL,
		Level int NOT NULL,
		Created_On int NOT NULL,
		Updated_On int NOT NULL,
		PRIMARY KEY (Question_Id)
		);

		CREATE TABLE moralDilemma.options
		(
		Option_Id int NOT NULL AUTO_INCREMENT,
		Question_Id int NOT NULL,
		Level int NOT NULL,
		Option_String varchar(255) NOT NULL,
		Created_On int NOT NULL,
		Updated_On int NOT NULL,
		PRIMARY KEY (Option_Id),
		FOREIGN KEY (Question_Id) REFERENCES questions(Question_Id)
		);

		CREATE TABLE moralDilemma.users
		(
		User_Id int NOT NULL AUTO_INCREMENT,
		User_Name varchar(255) NOT NULL,
		Unique_User_Id varchar(200) UNIQUE,
		User_Type varchar(20),
		Created_On int NOT NULL,
		Updated_On int NOT NULL,
		PRIMARY KEY (User_Id)
		); 

		CREATE TABLE moralDilemma.answers
		(
		Answer_Id int NOT NULL AUTO_INCREMENT,
		User_Id int NOT NULL,
		Round_Id varchar(20) NOT NULL,
		Question_Id int NOT NULL,
		Option_Id int NOT NULL,
		Option_Value varchar(20) NOT NULL,
		Is_Final BIT NOT NULL,
		Time_Spend int NOT NULL,
		Created_On int NOT NULL,
		Updated_On int NOT NULL,
		PRIMARY KEY (Answer_Id),
		FOREIGN KEY (Question_Id) REFERENCES questions(Question_Id),
		FOREIGN KEY (Option_Id) REFERENCES options(Option_Id),
		FOREIGN KEY (User_Id) REFERENCES users(User_Id)
		);

		CREATE TABLE moralDilemma.incompleteAnswers
		(
		Incomplete_Id int NOT NULL AUTO_INCREMENT,
		User_Id int NOT NULL,
		Round_Id varchar(20) NOT NULL,
		Question_Id int NOT NULL,
		Created_On int NOT NULL,
		Updated_On int NOT NULL,
		PRIMARY KEY (Incomplete_Id),
		FOREIGN KEY (Question_Id) REFERENCES questions(Question_Id),
		FOREIGN KEY (User_Id) REFERENCES users(User_Id)
		);

		CREATE TABLE moralDilemma.logs
		(
		Log_Id int NOT NULL AUTO_INCREMENT,
		User_Id int NOT NULL,
		Round_Id varchar(20) NOT NULL,
		Log_Type varchar(20) NOT NULL,
		Comment varchar(40),
		Created_On int NOT NULL,
		Updated_On int NOT NULL,
		PRIMARY KEY (Log_Id),
		FOREIGN KEY (User_Id) REFERENCES users(User_Id)
		);


		CREATE TABLE moralDilemma.loadingtime
		(
		Loading_Id int NOT NULL AUTO_INCREMENT,
		User_Id int,
		Round_Id varchar(20),
		Time_Taken int NOT NULL,
		Created_On int NOT NULL,
		Updated_On int NOT NULL,
		PRIMARY KEY (Loading_Id)
		);

		CREATE TABLE moralDilemma.screens
		(
		Screen_Id int NOT NULL AUTO_INCREMENT,
		Screen_Name varchar(255) NOT NULL,
		Created_On int NOT NULL,
		Updated_On int NOT NULL,
		PRIMARY KEY (Screen_Id)
		);

		CREATE TABLE moralDilemma.screensRecord
		(
		Screen_Record_Id int NOT NULL AUTO_INCREMENT,
		User_Id int NOT NULL,
		Round_Id varchar(20) NOT NULL,
		Screen_Id int NOT NULL,
		Time_Spend int NOT NULL,
		Created_On int NOT NULL,
		Updated_On int NOT NULL,
		PRIMARY KEY (Screen_Record_Id),
		FOREIGN KEY (Screen_Id) REFERENCES screens(Screen_Id)
		);

Insert Data in Table

		INSERT INTO moralDilemma.questions (Question_String, Level, Created_On, Updated_On) VALUES ("How would you allocate the winnings from this towards the following 4 options. Note that you have only the options as given below -",1, 1458125792505, 1458125792505);

		INSERT INTO moralDilemma.questions (Question_String, Level, Created_On, Updated_On) VALUES ("What would you do? You have the following options -",2, 1458125792505, 1458125792505);

		INSERT INTO moralDilemma.questions (Question_String, Level, Created_On, Updated_On) VALUES ("What would you do? You have the following options -",3, 1458125792505, 1458125792505);

		INSERT INTO moralDilemma.questions (Question_String, Level, Created_On, Updated_On) VALUES ("What would you do? You have the following options -",4, 1458125792505, 1458125792505);





		INSERT INTO moralDilemma.options (Question_Id, Level, Option_String, Created_On, Updated_On) VALUES (1,1, "A car", 1458125792505, 1458125792505);

		INSERT INTO moralDilemma.options (Question_Id, Level, Option_String, Created_On, Updated_On) VALUES (1,1, "Vacation", 1458125792505, 1458125792505);

		INSERT INTO moralDilemma.options (Question_Id, Level, Option_String, Created_On, Updated_On) VALUES (1,1, "Daughter’s wedding", 1458125792505, 1458125792505);

		INSERT INTO moralDilemma.options (Question_Id, Level, Option_String, Created_On, Updated_On) VALUES (1,1, "Starting a business for your son", 1458125792505, 1458125792505);



		INSERT INTO moralDilemma.options (Question_Id, Level, Option_String, Created_On, Updated_On) VALUES (2,2, "Meet him and agree to give him the full amount", 1458125792505, 1458125792505);

		INSERT INTO moralDilemma.options (Question_Id, Level, Option_String, Created_On, Updated_On) VALUES (2,2, "Meet him to agree that you will give him 50% i.e. Rs 50 lakhs", 1458125792505, 1458125792505);

		INSERT INTO moralDilemma.options (Question_Id, Level, Option_String, Created_On, Updated_On) VALUES (2,2, "Meet him and agree to give him Rs 10 lakhs for his mother’s treatment", 1458125792505, 1458125792505);

		INSERT INTO moralDilemma.options (Question_Id, Level, Option_String, Created_On, Updated_On) VALUES (2,2, "Meet him to tell him that this is finders keeper - since you found the ticket it was your luck that brought in the fortune.", 1458125792505, 1458125792505);


		INSERT INTO moralDilemma.options (Question_Id, Level, Option_String, Created_On, Updated_On) VALUES (3,3, "agree to give him the full amount", 1458125792505, 1458125792505);

		INSERT INTO moralDilemma.options (Question_Id, Level, Option_String, Created_On, Updated_On) VALUES (3,3, "agree that you will give him 50% i.e. Rs 50 lakhs", 1458125792505, 1458125792505);

		INSERT INTO moralDilemma.options (Question_Id, Level, Option_String, Created_On, Updated_On) VALUES (3,3, "agree to give him Rs 10 lakhs for his mother’s treatment", 1458125792505, 1458125792505);

		INSERT INTO moralDilemma.options (Question_Id, Level, Option_String, Created_On, Updated_On) VALUES (3,3, "tell him that this is finders keeper - since you found the ticket it was your luck that brought in the fortune.", 1458125792505, 1458125792505);


		INSERT INTO moralDilemma.options (Question_Id, Level, Option_String, Created_On, Updated_On) VALUES (4,4, "agree to give him the full amount", 1458125792505, 1458125792505);

		INSERT INTO moralDilemma.options (Question_Id, Level, Option_String, Created_On, Updated_On) VALUES (4,4, "agree that you will give him 50% i.e. Rs 50 lakhs", 1458125792505, 1458125792505);

		INSERT INTO moralDilemma.options (Question_Id, Level, Option_String, Created_On, Updated_On) VALUES (4,4, "agree to give him Rs 10 lakhs for his mother’s treatment", 1458125792505, 1458125792505);

		INSERT INTO moralDilemma.options (Question_Id, Level, Option_String, Created_On, Updated_On) VALUES (4,4, "tell him that this is finders keeper - since you found the ticket it was your luck that brought in the fortune.", 1458125792505, 1458125792505);


		INSERT INTO moralDilemma.screens (Screen_Name, Created_On, Updated_On) VALUES ("Welcome", 1458125792505, 1458125792505);

		INSERT INTO moralDilemma.screens (Screen_Name, Created_On, Updated_On) VALUES ("Level 1", 1458125792505, 1458125792505);

		INSERT INTO moralDilemma.screens (Screen_Name, Created_On, Updated_On) VALUES ("Lever 2", 1458125792505, 1458125792505);

		INSERT INTO moralDilemma.screens (Screen_Name, Created_On, Updated_On) VALUES ("Level 3", 1458125792505, 1458125792505);

		INSERT INTO moralDilemma.screens (Screen_Name, Created_On, Updated_On) VALUES ("Lever 4", 1458125792505, 1458125792505);

		INSERT INTO moralDilemma.screens (Screen_Name, Created_On, Updated_On) VALUES ("Thank You", 1458125792505, 1458125792505);
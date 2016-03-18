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
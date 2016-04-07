
1. Register Incomplete Answer

DELIMITER $$

CREATE PROCEDURE `registerIncompleteAnswer` (IN User_Id INT(11), IN Round_Id VARCHAR(20), IN Question_Id INT(11), IN Created_On INT(11),IN Updated_On INT(11))
BEGIN
INSERT INTO moralDilemma.incompleteAnswers (User_Id, Round_Id, Question_Id, Created_On, Updated_On) VALUES (User_Id, Round_Id, Question_Id, Created_On, Updated_On);
END

For Test

set @User_Id = 1;
set @Round_Id = '7b65f1f0-ec22-11l4-b';
set @Question_Id = 2;
set @Created_On = 2147483647;
set @Updated_On = 2147483647;
CALL `moralDilemma`.`registerIncompleteAnswer`(@User_Id, @Round_Id,@Question_Id,@Created_On,@Updated_On);

2. Register Log

DELIMITER $$

CREATE PROCEDURE `registerLog` (IN User_Id INT(11), IN Round_Id VARCHAR(20), IN Log_Type VARCHAR(20), IN Comment VARCHAR(40), IN Created_On INT(11),IN Updated_On INT(11))
BEGIN
INSERT INTO moralDilemma.logs (User_Id, Round_Id, Log_Type, Comment, Created_On, Updated_On) VALUES (User_Id, Round_Id, Log_Type, Comment, Created_On, Updated_On);
END

For Test

set @User_Id = 1;
set @Round_Id = '7b65f1f0-ec22-11l4-b';
set @Log_Type = 'Replay';
set @Comment = 'Levelscene_03';
set @Created_On = 2147483659;
set @Updated_On = 2147483659;
CALL `moralDilemma`.`registerLog`(@User_Id, @Round_Id, @Log_Type, @Comment, @Created_On, @Updated_On);

3. Registered Loading Time

DELIMITER $$

CREATE PROCEDURE `registerLoadingTime` (IN User_Id INT(11), IN Round_Id VARCHAR(20), IN Time_Taken INT(11), IN Created_On INT(11),IN Updated_On INT(11))
BEGIN
INSERT INTO moralDilemma.loadingtime (User_Id, Round_Id, Time_Taken, Created_On, Updated_On) VALUES (User_Id, Round_Id, Time_Taken, Created_On, Updated_On);
END

For Test

set @User_Id = 1;
set @Round_Id = '7b65f1f0-ec22-11l4-b';
set @Time_Taken = 7655;
set @Created_On = 2147483659;
set @Updated_On = 2147483659;
CALL `moralDilemma`.`registerLoadingTime`(@User_Id, @Round_Id, @Time_Taken, @Created_On, @Updated_On);

4. Get Screen

DELIMITER $$

CREATE PROCEDURE `getScreen`()
BEGIN
SELECT * FROM moralDilemma.screens;
END

For Test

CALL `moralDilemma`.`getScreen`();

5. Record Screen

DELIMITER $$

CREATE PROCEDURE `recordScreen` (IN User_Id INT(11), IN Round_Id VARCHAR(20), IN Screen_Id INT(11), IN Time_Spend INT(11), IN Created_On INT(11),IN Updated_On INT(11))
BEGIN
INSERT INTO moralDilemma.screensRecord (User_Id, Round_Id, Screen_Id, Time_Spend, Created_On, Updated_On) VALUES (User_Id, Round_Id, Screen_Id, Time_Spend, Created_On, Updated_On);
END

For Test

set @User_Id = 1;
set @Round_Id = '7b65f1f0-ec22-11l4-b';
set @Screen_Id = 1;
set @Time_Spend = 76555;
set @Created_On = 2147483659;
set @Updated_On = 2147483659;
CALL `moralDilemma`.`recordScreen`(@User_Id, @Round_Id, @Screen_Id, @Time_Spend, @Created_On, @Updated_On);

6. Get Question List

DELIMITER $$

CREATE PROCEDURE `getQuestionList` (IN p_Level INT(11))
BEGIN
SELECT options.Question_Id, options.Option_Id, options.Level,  options.Option_String, questions.Question_String FROM options INNER JOIN questions ON options.Question_Id=questions.Question_Id WHERE options.Level = p_Level;
END

For Test

set p_Level = 1;
CALL `moralDilemma`.`getQuestionList`(p_Level);

7. Check Existing User

DELIMITER $$

CREATE PROCEDURE `checkExistingUser` (IN p_Unique_User_Id VARCHAR(200))
BEGIN
SELECT * FROM moralDilemma.users WHERE Unique_User_Id= p_Unique_User_Id;
END

For Test

set @p_Unique_User_Id = 'eb55f8199d79f95ea2dce7a9a6c274ce';
CALL `moralDilemma`.`checkExistingUser`(@p_Unique_User_Id);

8. Create New User

DELIMITER $$

CREATE PROCEDURE `createNewUser` (IN User_Name VARCHAR(255),IN p_Unique_User_Id VARCHAR(200),IN User_Type VARCHAR(20),IN Created_On INT(11),IN Updated_On INT(11))
BEGIN
INSERT INTO moralDilemma.users (User_Name, Unique_User_Id, User_Type, Created_On, Updated_On) VALUES (User_Name,p_Unique_User_Id,User_Type,Created_On,Updated_On);

SELECT User_Id FROM moralDilemma.users WHERE Unique_User_Id = p_Unique_User_Id;

END

For Test

set @User_Name = 'gaurav';
set @p_Unique_User_Id = '7b65f1f0-ec22-11l4-b';
set @User_Type = 'google';
set @Created_On = 2147483659;
set @Updated_On = 2147483659;
CALL `moralDilemma`.`createNewUser`(@User_Name, @p_Unique_User_Id, @User_Type, @Created_On, @Updated_On);

9. Register Answers

DELIMITER $$
CREATE PROCEDURE
  `registeranswers` (IN user_id       INT(11),
                     IN round_id      VARCHAR(20),
                     IN question_id   INT(11),
                     IN option_id    INT(11),
                     IN option_value VARCHAR(20),
                     IN is_final     bit(11),
                     IN time_spend    INT(11),
                     IN created_on    INT(11),
                     IN updated_on    INT(11))
BEGIN
  INSERT INTO moralDilemma.answers
              (
                          user_id,
                          round_id,
                          question_id,
                          option_id,
                          option_value,
                          is_final,
                          time_spend,
                          created_on,
                          updated_on
              )
              VALUES
              (
                          user_id,
                          round_id,
                          question_id,
                          option_id,
                          option_value,
                          is_final,
                          time_spend,
                          created_on,
                          updated_on
              );END
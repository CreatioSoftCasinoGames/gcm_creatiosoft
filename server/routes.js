// Load modules

var User = require('./controller/user');


// API Server Endpoints
module.exports = function(app){

  app.get('/', function(req, res) {
        res.render('index');
    });
  app.route('/questions')
     .get(User.getQuestionList);

  app.route('/registerUser')
     .post(User.registerUser);

  app.route('/registerAnswers')
     .post(User.registerAnswers);

  app.route('/registerIncompleteAnswer')
     .post(User.registerIncompleteAnswer);

  app.route('/registerLog')
     .post(User.registerLog);

  app.route('/registerLoadingTime')
     .post(User.registerLoadingTime);

  app.route('/getScreenEvent')
     .get(User.getScreen);

  app.route('/recordScreen')
     .post(User.recordScreen);
 
}

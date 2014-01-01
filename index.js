var passport = require('passport'),
	GoogleStrategy = require('passport-google').Strategy,
	users = require('./users.json'),
	googleConfig = require('./google-config');

function findByUsername(username, callback) {
	var user;

	for (var i = 0, len = users.length; i < len; i++) 
	{
  		user = users[i];
  		if (user.username === username) 
	  	{
	    	return fn(null, user);
	  	}
	}
	return callback(null, null);
}

function findById(id, fn) {
	var idx = id - 1;
	if (users[idx]) 
	{
  		fn(null, users[idx]);
	} 
	else {
  		fn(new Error('User ' + id + ' does not exist'));
	}
}

function HandleGoogleAuth(openId, profile, done) {
	    		

	findByUsername(profile.emails[0].value, function(err, user) {
  		if (err) 
  		{ 
  			return done(err); 
  		}
  		if (!user) 
  		{ 
  			return done(null, false, { 
  				message: 'Unknown user ' + username 
  			}); 
  		}
  
  		return done(null, user);
	});

}



exports = module.exports = function(app, settings) {

	settings = settings || {
		loginPage: "/login",
		loginPath: "/login/google",
		logoutPath: "/logout",
		homePage: "/"
	};

	passport.serializeUser(function(user, done) {
    	done(null, user.id);
  	});

  	passport.deserializeUser(function(id, done) {
   		findById(id, function (err, user) {
      		done(err, user);
    	});
  	});

  	passport.use( new GoogleStrategy(googleConfig, HandleGoogleAuth ));

  	// Redirect the user to Google for authentication.  When complete, Google
	// will redirect the user back to the application at
	//     /auth/google/return
	app.get(settings.loginPath, passport.authenticate('google') );

	// Google will redirect the user to this URL after authentication.  Finish
	// the process by verifying the assertion.  If valid, the user will be
	// logged in.  Otherwise, authentication has failed.
	app.get(
		googleConfig.returnURL,
		passport.authenticate('google', { 
			successRedirect: settings.homePage,
			failureRedirect: settings.loginPage 
		})
	);


	app.get(settings.logoutPath, function(req, res){
	    req.logout();
	    res.redirect( settings.homePage );
	});



	return function (req, res, next) {
		if (req.isAuthenticated()) 
		{
			return next();
		} 
		else {
			res.redirect( settings.loginPage );
		}
	};
};
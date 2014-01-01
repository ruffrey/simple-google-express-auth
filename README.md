# Google auth in express, super easy

## Usage
First edit `google-config.js` and `users.json` to fit your express app.
	
	. . .
	
	var GoogleAuth = require('simple-google-express-auth');
	var AuthCheck = GoogleAuth(app);

	app.all('/admin*', AuthCheck);

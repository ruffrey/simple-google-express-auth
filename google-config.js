var goog = {
	returnURL: "http://localhost:8080/auth/google/return",
	realm: "http://localhost:8080/"
};
if(process.env.NODE_ENV=="prod")
{
	goog = {
		returnURL: "http://mongo.sylog.net/auth/google/return",
		realm: "http://mongo.sylog.net/"
	};
}
exports = module.exports = goog;
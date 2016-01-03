var Parse = require('parse');

module.exports = {
	User: Parse.User,
	Category: Parse.Object.extend(),
	Tag: Parse.Object.extend(),
	Item: Parse.Object.extend(),
};

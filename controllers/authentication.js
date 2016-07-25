const jwt = require('jwt-simple');
const config = require('../config');

const User = require('../models/user');

function tokenForUser(user){
	const timestamp=new Date().getTime();
	return jwt.encode({sub:user.id, iat:timestamp}, config.secret);
}

exports.signin = function(req, res, next){
	//user has had email and password authorized
	//we need to give user a token
	res.send({token: tokenForUser(req.user)}); 
}

exports.signup = function(req, res, next) {
	const email = req.body.email;
	const password = req.body.password;

	if(!email || !password){
		return res.status(422).send({error:'Email and password required'});
	}

	User.findOne({email:email}, function(err, existingUser){
		if (err){ return next(err); }
		if (existingUser){
			return res.status(422).send({error:'That email taken'});
		}	

		const user = new User({
			email:email,
			password:password
		})

		user.save(function(err){
			if(err){return next(err);}
				console.log("signed up");
			res.json({ token:tokenForUser(user) });
		});
	})


}
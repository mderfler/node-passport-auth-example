const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

const userSchema = new Schema({
	email:{type: String, unique: true, lowercase: true},
	password: String
});

userSchema.pre('save', function(next){
  const user = this;//this is the user about to be created

  //create salt then run callback
  bcrypt.genSalt(10, function(err, salt){
	if(err){return next(err);}

	//hash (encrypt) our password using the salt
	bcrypt.hash(user.password, salt, null, function(err, hash){
		if(err){return next(err);}
		//overwrite password with salt
		user.password = hash;
		//console.log(hash);
		next();
	});	
  });
});

userSchema.methods.comparePassword = function(candidatePassword, callback){
	bcrypt.compare(candidatePassword, this.password, function(err,isMatch){
		if(err){return callback(err);}
		callback(null, isMatch);
	})
}

const ModelClass = mongoose.model('user', userSchema);

module.exports = ModelClass;
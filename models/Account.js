module.exports = function(config, mongoose, nodemailer){

	var crypto = require ('crypto');

	var AccountSchema = new mongoose.Schema({
		email 		: {type: String, unique : true}, 
		password 	: {type: String},
		name 		: {
					first :{type:String},
					last :{type:String}
				  }, 
		birthday 	:{
					day 	: {type : Number , min:1, max :31 , required : false}, 
					month 	: {type : Number , min:1, max :12 , required : false}, 
					day 	: {type : Number , min:1800} 
				 },
		photoUrl 	: {type: String},
		biography 	: {type: String}
	});

	var Account = mongoose.model('Account', AccountSchema);

	var registerCallback = function(err){
		if(err){
			return console.log(err);
		}
		else{
			return console.log('Account was just Created');
		}
	};

	var changePassword = function(accountId, newPassword){
		var shaSum=crypto.createHash('sha256');
		shaSum.update(newPassword);
		var hashedPassword = shaSum.digest('hex');
		Account.update({_id : accountId}, {$set:{password:hashedPassword}}, {upsert:false},
			function changePasswordCallback(err){
				console.log('Change password for account ' + accountId);
			}
		) ; 
	};

	var forgotPassword = function(email, resetPasswordUrl, callback){
		var user = Account.findOne({email : email}, function findAccount(err, doc){
			if(err){
				callback(false);
			}
			else{
				var smtpTransport = nodemailer.createTransport('SMTP', config.mail);
				resetPasswordUrl +='?account'+doc._id;
				smtpTransport.sendMail({
						from 		: 'amador.rubal@gmail.com',
						to 		: doc.email,
						subject  	: 'Social Bitch Password Request ',
						text 		: 'Click here to rest your Password ' + resetPasswordUrl
					}
						, function forgotPasswordResult(err){
							if(err){
								callback(false);
							}
							else{
								callback(true);
							}
				});
			}
		});
	};

	var login = function(email, password, callback){
		var shaSum = crypto.createHash('sha256');
		shaSum.update(password);
		Account.findOne({email : email, password : shaSum.digest('hex')}, function(err, doc){
			callback(null!=doc)
		})
	};

	var register = function (email, password, firstName, lastName){
		var shaSum = crypto.createHash('sha256');
		shaSum.update(password);

		console.log('Registering ' + email);
		var user = new Account({
			email : email,
			name: {
				first : firstName,
				last : lastName
			},

			password : shaSum.digest('hex')
		});

		user.save(registerCallback);
		console.log('Save command triggered');
	};

	return {
		register  		: register,
		forgotPassword 	: forgotPassword,
		changePassword 	: changePassword,
		login 			: login,
		Account 		: Account

	}
 }
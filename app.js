var 	express  	= require('express'),
	app 		= express(),
	nodemailer 	=require('nodemailer'),
	MemoryStore 	=require('connect').session.MemoryStore,
	mongoose 	=require('mongoose'),
	config 		={},
	Account 	=require('./models/Account')(config, mongoose, nodemailer);

app.configure(function(){
	app.set('view engine', 'jade');
	app.use(express.static(__dirname + '/public'));
	app.use(express.bodyParser());
	app.use(express.cookieParser());
	app.use(express.session(
					{secret : "Social Biatch Key", store : new MemoryStore()}
				));
	mongoose.connect('mongodb://localhost/nodebackbone');
	});

app.get('/account/authenticated', function(req, res){
	if(req.session.loggedIn){
		res.send(200);
	}
	else{
		res.send(401);
	}
});

app.post('/register', function(req, res){
	var 	firstName 		=req.param('firstName', ''),
		lastName 		=req.param('lastName', ''),
		email 			=req.param('email', ''),
		password 		=req.param('password', '');


	if(null==email || null == password){
		res.send(400);
		return;
	}
	Account.register(email, password, firstName, lastName);
	res.send(200);
});

app.post('/login', function(req, res){
	var 	email 			=req.param('email', ''),
		password 		=req.param('password', '');


	if(null==email || null == password){
		res.send(400);
		return;
	}
	Account.login(email, password, function(success){
		if(!success){
			res.send(401);
			return;
		}
		else{
			console.log('Succes login !');
			res.send(200);
		}
	});
});

app.get('/', function(req, res){
	res.render('index.jade', {layout : false});
});

app.listen(8080);
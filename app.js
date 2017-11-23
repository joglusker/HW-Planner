var express = require ('express');
var bodyParser = require ('body-parser');
var path = require ('path');
var expressValidator = require ('express-validator');
var mongojs = require('mongojs');
var db = mongojs('test', ['users']);
var app = express();
var ObjectId = mongojs.ObjectId;
var i = 0;
var logger = function(req, res, next){
i++;
console.log('logging... attempt #' + i);
next();
};

app.use(logger);

//View engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

//body parser middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

//Set static path
app.use(express.static(path.join(__dirname, 'public')));

//Global Variables
app.use(function(req, res, next){
	res.locals.errors = null;
	next();
});

//Express Validator Middleware
app.use(expressValidator({
	errorFormatter: function (param, msg, value, location){
	var namespace = param.split('.')
	, root	= namespace.shift()
	, formParam = root;
	
	while(namespace.length){
	formParam += '[' + namespace.shift() + ']';
	}
	return{
	param: formParam,
	msg: msg,
	value: value
	};
	}
	}));


app.get('/', function(req, res){
	// find everything
db.users.find(function(err, docs) {
    console.log(docs);
    res.render('index', {
		title: 'Student Accounts:',
		users: docs
	});
});
	
});

app.post('/users/add', function(req, res){

req.checkBody('first_name', 'First name required').notEmpty();
req.checkBody('last_name', 'Last name required').notEmpty();
req.checkBody('email', 'Email required').notEmpty();
req.checkBody('id', 'OSIS # is required').notEmpty();

var errors = req.validationErrors();

	if(errors){
	console.log('USER CREATED = ERROR');
	res.render('index', {
		title: 'Student Accounts:',
		users: users,
		errors: errors
	});
	} else {

	var newUser = {
	first_name: req.body.first_name,
	last_name: req.body.last_name,
	email: req.body.email,
	id: req.body.id,
}
	db.users.insert(newUser, function(err, result){
		if(err){
			console.log(err);
				}
		res.redirect('/');
	});
	}
});







app.post('/class/add', function(req, res){

var errors = req.validationErrors();

	if(errors){
	console.log('CLASS CREATED = ERROR');
	res.render('index', {
		title: 'Student Accounts:',
		//users: users,
		errors: errors
	});
	} else {

	var newClass = {
	class_name: req.body.class_name,
	start_time: req.body.start_time,
	end_time: req.body.end_time,
	id: req.body.user_id,
}
	db.classes.insert(newClass, function(err, result){
		if(err){
			console.log(err);
				}
		res.redirect('/');
	});
	}
});






app.delete('/users/delete/:id', function(req, res){
	console.log(req.params.id);
	db.users.remove({_id: ObjectId(req.params.id)}, function(err, result){
		if(err){
			console.log(err);
		}
		res.redirect(' /');
	});
});

app.listen(3000, function(){
console.log('Server started on port 3000');
});
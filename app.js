var express = require ('express');
var bodyParser = require ('body-parser');
var path = require ('path');
var expressValidator = require ('express-validator');

var app = express();
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
//app.use(express.static(path.join(__dirname, 'public')));

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

var users = [
	{
		id: 244795738,
		first_name: 'Peter',
		last_name: 'Glusker',
		email: 'johndoe@gmail.com',
	},
	{
		id: 448905772,
		first_name: 'Bob',
		last_name: 'Appleseed',
		email: 'bobappleseed@gmail.com',
	},
	{
		id: 382567744,
		first_name: 'Steve',
		last_name: 'Bernstein',
		email: 'steveberbstein@gmail.com',
	}
]

app.get('/', function(req, res){
	res.render('index', {
		title: 'Student Accounts:',
		users: users
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
console.log('USER CREATED = SUCCESS');
}

});

app.listen(3000, function(){
console.log('Server started on port 3000');
});


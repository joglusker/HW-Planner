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
var newUser = {
	first_name: req.body.first_name,
	last_name: req.body.last_name,
	email: req.body.email,
	id: req.body.id,
}
console.log(newUser);
});

app.listen(3000, function(){
console.log('Server started on port 3000');
});


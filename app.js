//dependency modules
var express=require('express');

var publicDir = require(__dirname, '/public');
var routes=require(__dirname,'./routes');
var http=require('http');
var path=require('path');
var stylus = require('express-stylus');
var nib = require('nib');
var join = require('path').join;
var bodyParser=require('body-parser');
var users=require('./routes/users');
var routes=require('./routes/index');
var routes2=require('./routes/appointment');
var session=require('express-session');
var expressValidator=require('express-validator');
var flash=require('connect-flash');
var passport=require('passport');
var localStrategy=require('passport-local'), Strategy;
var cookieParser=require('cookie-parser');

var mysql=require('mysql');
var nodemailer=require('nodemailer');
var xoauth2=require('xoauth2');


//starting app
var app=express();

//set static folder
app.use(express.static('public'));

//body parser-middleware
app.use(bodyParser.json());
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));


//cookie parser
app.use(cookieParser());


//all environments
app.set('port',process.env.PORT || 5000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
console.log('View engine activated..')

//express session-middle ware
app.use(session({
    secret:'secret',
    saveUninitialized:false,
    resave:false
}));


//connect flash
app.use(flash());

//express validator
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));
//user routes
app.use('/users',users);
app.use('/', routes);
app.use('/appointment',routes2);
console.log('Routes created..')

//server
app.listen(3000,function(err){
	if(err){
		console.log(err);
	}else console.log('Server listening at /localhost:3000');
})
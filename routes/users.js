/**
 * Created by Vinodh.P on 23-05-2017.
 */
var express=require('express');
var router=express.Router();

var mysql=require('mysql');


const nodemailer=require('nodemailer');
const xoauth2=require('xoauth2');

let transporter=nodemailer.createTransport({
     service : 'gmail',
     secure:false,
     port:25,
     auth:{
          user:'noreply.manubolu.hospitals@gmail.com',
          pass:'shekhar@0025'
     },
     tls:{
      rejectUnauthorized:false
     }

});



//Creating connection object and Connection pool
var connection=mysql.createPool({
  //properties
  connectionLimit:50,
  host:'localhost',
  user:'root',
  password:'root',
  database:'prs_data'

});
//Register
router.get('/signup', function(req, res, next){
    res.render('signup',{message:"Enter Required values"});
    req.session.errors=null;
    console.log('User Sign Up page opened..')
});
//Login
router.get('/login', function(req,res){
    res.render('login');
    console.log('User Login page opened..')
});
//Logout
router.get('/logout', function(req,res){
    res.render('logout');
    console.log('User sign out');
});
//feedback
router.get('/feedback', function(req,res){
    res.render('feedback');
});


//signup
router.post('/signup',function(req,res){
     //read form data
      	 var fname=req.body.firstname;
      	 var lname=req.body.lastname;
      	 var email=req.body.email;
      	 var pass=req.body.password;
         var user=[[fname,lname,email,pass]];
       connection.getConnection(function(err,tempCont){
        if(!!err){
        tempCont.release();
        console.log('Error while connecting database');
      }else{
          console.log('Connected to database');
           var sql='INSERT INTO register VALUES ?';
            tempCont.query(sql,[user],function(err, result, fields){
          if(!!err){
            tempCont.release();
            console.log('Error in query');
          }else {
            console.log('User registered successfully');
            tempCont.release();
            console.log('Database Disconnected')
            res.send("<div align='center'><marquee behavior='scroll' direction='left' bgcolor='aqua' width='450' height='20'>Thanks for Choosing Manubolu Hospitals </marquee><h1 style='color:blue'> You are successfully Registered..!!</h1><h3 style='color:red'>Please confirm your email.</h3>To enter your email: <a target='_blank' href='https://mail.google.com'>Gmail</a> , <a target='_blank' href='https://login.yahoo.com/?.src=ym&.intl=us&.lang=en-US&.done=https%3a//mail.yahoo.com'>Yahoo Mail</a></div>");
            
            let helperOptions= {
                    from:' "Manubolu Hospitals" <noreply.manubolu.hospitals@gmail.com>',
                    to:email,
                    subject:'NO-REPLY || Registration Confirmation ',
                    html:"<h1>Hi, Thanks for Choosing <b>Manubolu Hospitals</h1> . <a href='http://localhost:3000/'> Click to Confirm your email</a> "
  
                 }
                 transporter.sendMail(helperOptions,function(err,res){
                  if(err){
                    console.log('Error to send email');
                  }else{
                    console.log('Email is sent to registered User'); 
                  }
                 })
           }
         });   
       }
      });
    	  
	});

//User Login
router.post('/login', function(req,resp){
        var email= req.body.email;
        var pass= req.body.password;
        var user=[[email,pass]];
        connection.getConnection(function(err,tempCont){
        if(!!err){
        tempCont.release();
        console.log('Error while connecting database');
      }else{
          console.log('Connected to database');
           var sql='SELECT register.email, register.password from register;'
            tempCont.query(sql,function(err, result, fields){
          if(!!err){
            tempCont.release();
            console.log('invalid query');
          }else {
            console.log('Valid query');
            console.log('The solutions is'+result);
            console.log(result.password);
            resp.redirect('/manubolu_hospitals/home');
            /*if(result.length>0){
              if([0].password==user.pass && [0].email==user.email){
                console.log('Valid User');
                resp.redirect('/home');
              }
              else console.log('Invalid Credentials');
              //resp.send('/users/login');
            }*/
            
           }
         });   
       }
      });
        
    	
    });

//feedback POST
router.post('/feedback',function(req,res){
     //read form data
         var name=req.body.name;
         var regarding=req.body.regarding;
         var msg=req.body.comments;
         var rating=req.body.rating;
         var feedback=[[name,regarding,msg,rating]];
       connection.getConnection(function(err,tempCont){
        if(!!err){
        tempCont.release();
        console.log('Error while connecting database');
      }else{
          console.log('Connected to database');
           var sql='INSERT INTO feedback VALUES ?';
            tempCont.query(sql,[feedback],function(err, result, fields){
          if(!!err){
            tempCont.release();
            console.log('Error in query');
          }else {
            console.log('feedback values stored successfully');
            tempCont.release();
            console.log('Database Disconnected')
            res.send("<div align='center'><h1 style='color:blue'> Thanks for your valuable Feedback</h1><a href='/manubolu_hospitals/home'>Home</a></div>");
              
            
           }
         });   
       }
      });
        
  });

module.exports=router;
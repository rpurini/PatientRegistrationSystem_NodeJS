var express=require('express');
var router=express.Router();

var mysql=require('mysql');

//Sending messages
var accountSid = 'AC787f54b38eed26ee596c72cacc0f7f27'; // Your Account SID from www.twilio.com/console
var authToken = '0e1a9992648e552a8672ccf0d8330eff';   // Your Auth Token from www.twilio.com/console

var twilio = require('twilio');
var client = new twilio(accountSid, authToken);

//Creating connection object and Connection pool
var connection=mysql.createPool({
  //properties
  connectionLimit:50,
  host:'localhost',
  user:'root',
  password:'root',
  database:'prs_data'

});

//GET views
router.get('/make_an_appointment', function(req, res){
    res.render('make_appointment');
});
router.get('/view_an_appointment', function(req, res){
    res.render('view_appointment');
});
router.get('/reschedule_an_appointment', function(req, res){
    res.render('reschedule_appointment');
});
router.get('/cancel_an_appointment', function(req, res){
    res.render('cancel_appointment');
});

//POST FORM DATA

//make appointment
router.post('/make_an_appointment',function(req,res){
	console.log('post:make_appointment');
     //read form data
      	 var fname=req.body.firstname;
      	 var lname=req.body.lastname;
         var mobile=req.body.mobile;
      	 var age=req.body.age;
      	 var gender=req.body.gender;
      	 var location=req.body.location;
         var doctor=req.body.doctor;
      	 var date=req.body.date;
      	 var time=req.body.time;
      	 


         var user=[[fname,lname,mobile,age,gender,location,doctor,date,time]];

       connection.getConnection(function(err,tempCont){
        if(!!err){
        tempCont.release();
        console.log('Error while connecting database');
         }else{
          console.log('Connected to database');
           var sql='INSERT INTO appointments VALUES ?';
            tempCont.query(sql,[user],function(err, result, fields){
          if(!!err){
            tempCont.release();
            console.log('Error in query');
            res.send("<div align='center'><h1 style='color:red'>Problem while making Appointment. </h1><h3 style='color:orange'>Please enter proper Insurance ID</h3><a href='/appointment/make_an_appointment'>Back</a> || <a href='/home'>Home</a></div>");
          }else {
            console.log('Appointment created Successfully');
            res.send("<div align='center'><h1 style='color:blue'>Your Appointment is created Successfully..! </h1><h2>Appointment details sent to Your mobile.</h2></br><a href='/appointment/view_an_appointment'>View Your Appointment</a> || <a href='/manubolu_hospitals/home'>Home</a></div> ");
            
            //send message to registered mobile
           
            client.messages.create({
                  body: 'Your appointment is scheduled Successfully with Manubolu Hospitals . On '+date+','+' by '+time+' with '+doctor+ ' at '+location+' **THANK YOU/n***',
                  to: mobile,  // Text this number
                  from:'+14159360008' // From a valid Twilio number
                 })
                .then((message) => console.log('message sent to mobile'));

            tempCont.release();
           	console.log('Database Disconnected')
        }
         });   
       }
      });
    	  
	});

//View Appointment
  router.post('/view_an_appointment',function(req,res){
	console.log('post:view_appointment');
     //read form data
      	 
      	 var mobile=req.body.mobile;
         var view=[[mobile]];

       connection.getConnection(function(err,tempCont){
        if(!!err){
        tempCont.release();
        console.log('Error while connecting database');
         }else{
          console.log('Connected to database');
          
          var sql='SELECT * FROM appointments WHERE mobile=?';

            tempCont.query(sql,[view], function(err, result, fields){
          if(!!err){
            tempCont.release();
            console.log('Error in query');
            
          }else if(result.length >0) {
            console.log('Appointment Details');
            res.send("<div ><h2>Your Appointment Details:</h2><strong>Patient Name:</strong>"+result[0].first_name+" "+result[0].last_name+"</br><strong>Age:</strong>"+result[0].age+"</br><strong>Gender:</strong>"+result[0].gender+"</br><strong>Location:</strong>"+result[0].location+"</br><strong>Specialist Name:</strong>"+result[0].doctor+"</br><strong>Date & Time:</strong>"+result[0].date+","+result[0].time+"</br><a href='/appointment/view_an_appointment'>Back</a> <a href='/manubolu_hospitals/home'>Home</a></div>");
           tempCont.release();
           	  console.log('Database Disconnected')
           }
           else{
           	  console.log('No details Found');
           	  res.send('No Details Found');
           	  tempCont.release();
           	  console.log('Database Disconnected')
           }
         });   
       }
      });
    	  
	});

//Cancel Appointment

router.post('/cancel_an_appointment',function(req,res){
	console.log('post:cancel_appointment');
     //read form data
      	 
      	 var mobile=req.body.mobile;
         var cancel=[[mobile]];

       connection.getConnection(function(err,tempCont){
        if(!!err){
        tempCont.release();
        console.log('Error while connecting database');
         }else{
          console.log('Connected to database');
          
          var sql='DELETE FROM appointments WHERE mobile=?';

            tempCont.query(sql,[cancel], function(err, result){
          if(!!err){
            tempCont.release();
            console.log('Error in query');
            
          }else if(result.affectedRows==1) {
            console.log('Appointment is Cancelled.');
            res.send("<div align='center'><h1 style='color:blue'>Your Appointment is Cancelled! </h1></br><a href='/appointment/make_an_appointment'>Make another Appointment</a> || <a href='/manubolu_hospitals/home'>Home</a></div> ");
            //send message to registered mobile
            client.messages.create({
                  body: 'Your appointment is Cancelled with Suresh Manubolu Hospitals **THANK YOU/n***',
                  to: mobile,  // Text this number
                  from:'+14159360008' // From a valid Twilio number
                 })
                .then((message) => console.log('message sent to mobile'));

            tempCont.release();
           	  console.log('Database Disconnected')
           }
           else{
           	  console.log('Invalid Mobile Number');
           	  res.send("<div align='center'><h1 style='color:red'>Invalid Mobile number.! </h1></br><a href='/appointment/cancel_an_appointment'>Please Try Again</a> , <a href='/manubolu_hospitals/home'>Home</a></div>");
           	  tempCont.release();
           	  console.log('Database Disconnected')
           }
         });   
       }
      });
    	  
	});


//Re-Schedule 
router.post('/re_schedule_an_appointment',function(req,res){
  console.log('post:make_appointment');
     //read form data
         
         var mobile=req.body.mobile;
         var location=req.body.location;
         var date=req.body.date;
         var time=req.body.time;
         var doctor=req.body.doctor;

         var data=[[mobile,location,date,time,doctor]];

       connection.getConnection(function(err,tempCont){
        if(!!err){
        tempCont.release();
        console.log('Error while connecting database');
         }else{
          console.log('Connected to database');
           var sql='UPDATE appointments SET location="'+location+'", date="'+date+'", time="'+time+'", doctor="'+doctor+'" WHERE mobile="'+mobile+'"';
            tempCont.query(sql, function(err, result, fields){
          if(!!err){
            tempCont.release();
            console.log('Error in query');
            console.log('Database Disconnected')

            res.send("<div align='center'><h1 style='color:red'>Sorry, the appointment is not Re-Scheduled. Please try again.! </h1><h3 style='color:orange'>Invalid Mobile Number.</h3><a href='/appointment/make_an_appointment'>Back</a> , <a href='/manubolu_hospitals/home'>Home</a></div>");
          }else {
            console.log('Appointment is Re-Scheduled');

            res.send("<div align='center'><h1 style='color:blue'>Your Appointment is Re-Scheduled..! </h1></br><a href='/appointment/reschedule_an_appointment'>Back</a> || <a href='/appointment/view_an_appointment'>View Your Appointment</a> ||  || <a href='/manubolu_hospitals/home'>Home</a></div> ");
             //send message to registered mobile
            client.messages.create({
                  body: 'Your appointment is Re-Scheduled Successfully with Manubolu Hospitals . On '+date+','+' by '+time+' with '+doctor+ ' at '+location+' **THANK YOU/n***',
                  to: mobile,  // Text this number
                  from:'+14159360008' // From a valid Twilio number
                 })
                .then((message) => console.log('message sent to mobile'));
            tempCont.release();
            console.log('Database Disconnected')
        }
         });   
       }
      });
        
  });



module.exports=router;
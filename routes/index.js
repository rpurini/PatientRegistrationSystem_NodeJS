var express=require('express');
var router=express.Router();
//home
router.get('/', function(req, res){
    res.render('login');
});

router.get('/manubolu_hospitals/home', function(req, res){
    res.render('home');
});

router.get('/about_manubolu_hospitals', function(req, res){
    res.render('about');
});
router.get('/contact_manubolu_hospitals', function(req, res){
    res.render('contact');
});

module.exports=router;
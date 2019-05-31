var express = require('express');
var router = express.Router();
var monk=require('monk');
var db=monk('localhost:27017/aditya');
var collection=db.get('signup');
console.log('connected'); 
var collection1=db.get('submit');     

/* GET home page. */
router.get('/',function(req,res)
{
	res.render('index');
});

router.get('/home',function(req,res)
{
	collection1.find({},function(err,docs){
		console.log(docs);
		res.locals.data=docs;

	
	res.render('home');
	});
});

router.post('/submit',function(req,res){
	var firstname=req.body.name;
	console.log(firstname); 

	var lastname=req.body.name2;
	console.log(lastname);

	var number=req.body.number;
	console.log(number);

	var email=req.body.email;
	console.log(email);

	collection1.insert({"firstname":req.body.name,"lastname":req.body.name2,"number":req.body.number,"email":req.body.email,});

res.redirect("/home");
	 });


router.post('/signup', function(req, res) {

	var name=req.body.name;
	console.log(name);

	var email=req.body.email;
	console.log(email);

	var password=req.body.password;
	console.log(password);

	var phonenumber=req.body.phonenumber;
	console.log(phonenumber);

	var gender=req.body.gender;
	console.log(gender);

	collection.insert({"name":name,"email":email,"password":password,"phonenumber":phonenumber,"gender":gender});
	 res.redirect("/");
	 });

  
  router.post('/login', function(req, res) {
  		 var username=req.body.name;
  		 console.log(username);

  		 var password=req.body.password;
  		 console.log(password);
  		 collection.findOne({"name":req.body.name,"password":req.body.password},function(err,docs){
  	if(!docs){
  		console.log("invalid");
  		res.render('index',{err:"invalid username(or)password"});
  	}
  	else if(docs){
  			console.log("success");
  			res.redirect('/home');
  		}
  		else{
  			console.log("error");
  		}
  	});
	 
	  });

  

module.exports = router;

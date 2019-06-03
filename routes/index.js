var express = require('express');
var router = express.Router();
var monk=require('monk');
var db=monk('localhost:27017/aditya');
var collection=db.get('signup');
console.log('connected'); 
var collection1=db.get('submit'); 
var moment=require('moment'); 
var nodemailer=require('nodemailer');  

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
   
router.post('/remove',function(req,res){
	var id=req.body.no;
	console.log(id);
	collection1.remove({"_id":id},function(err,docs){
		res.send(docs);

	});
});

router.post('/edit',function(req,res){
	var id=req.body.no;
	collection1.find({"_id":id},function(err,docs){
		res.send(docs);
	});
});

router.post('/update',function(req,res){
	var data={
		firstname:req.body.firstname,
		lastname:req.body.lastname,
		number:req.body.number,
		email:req.body.email,
	}
	collection1.update({"_id":req.body.id},{$set:data},function(err,docs){
		res.redirect('/home');

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

      var transporter = nodemailer.createTransport({
	  service: 'gmail.com',
	  auth: {
	    user: '16a91a1246@gmail.com',
	    pass: 'ramya1246'
	  }
	});

	var mailOptions = {
	  from: '16a91a1246@gmail.com',
	  to: req.body.email,
	  subject: 'successfully registered',
	  text: 'welcome to mean classes'
	};

	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    console.log("mail not send");
	  } else {
	    console.log('Email sent: ' + info.response);
	  }
	});



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

  		 var logintime=moment().format("DD-MM-YYYY");
  		 console.log(logintime);
  		 collection.update({"username":username,},{$set:{"logintime":logintime}})
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

 var express = require('express');
var router = express.Router();
var monk=require('monk');
var db=monk('localhost:27017/aditya');
var collection=db.get('signup');
console.log('connected'); 
var collection1=db.get('submit'); 
var moment=require('moment'); 
var nodemailer=require('nodemailer');  
var randomstring=require('randomstring');
var multer=require('multer');
//var sessions=require('client-sessions');
//var upload = multer({ dest: 'uploads/' });

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/images/')
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname)
  }
});
var upload = multer({ storage: storage })

/* GET home page. */
router.get('/',function(req,res)
{ 
	if(req.session&&req.session.user){
		res.locals.user==req.session.user;
		 res.redirect('/home');
	}
	else{
		req.session.reset();
		res.render('index');
	}
  
});

router.get('/forgotpassword',function(req,res)
{ 
	res.render('forgotpassword');
});
router.get('/logout',function(req,res){
	req.session.reset();
	res.redirect('/')
});

router.get('/home',function(req,res)
{
	if(req.session&&req.session.user){
		res.locals.user=req.session.user;
	collection1.find({},function(err,docs){
		console.log(docs);
		res.locals.data=docs;

	
	res.render('home');
	});
}
else{
	res.redirect('/')
}
});

router.post('/forgot',function(req,res){
	var email=req.body.email;
	console.log(email);
	var otp=randomstring.generate(5);
    var msg="<html><head></head><body><b>"+otp+"</b></body></html>";
    collection1.update({"email":email},{$set:{"password":otp}});

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
	  subject: 'password changed',
	  html:msg,
	};

	transporter.sendMail(mailOptions, function(error, info){
	  if (error) {
	    console.log("mail not send");
	  } else {
	    console.log('Email sent: ' + info.response);
	  }
	});
	res.redirect('/')
})
   
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


router.post('/submit', upload.single('image'),function(req,res){
	console.log(req.file);
	var firstname=req.body.name;
	console.log(firstname); 

	var lastname=req.body.name2;
	console.log(lastname);

	var number=req.body.number;
	console.log(number);

	var email=req.body.email;
	console.log(email);
	var image=req.file.originalname;
	console.log(image);

	collection1.insert({"firstname":req.body.name,"lastname":req.body.name2,"number":req.body.number,"email":req.body.email,"image":req.file.originalname});

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
  		    delete docs.password;
  		    req.session.user=docs;
  			console.log("success");
  			res.redirect('/home');
  		}
  		else{
  			
  			console.log("error");
  		}
  	});
	 
	  });

  

module.exports = router;

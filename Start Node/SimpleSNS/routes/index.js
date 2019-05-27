// routes/index.js

var express = require('express');
var router = express.Router();

var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

var mongoose = require('mongoose');
var db = mongoose.connect('mongodb+srv://memoUser:boraborasum7476!@mongo-memo-rlsck.mongodb.net/test?retryWrites=true', { useNewUrlParser: true });
var Schema = mongoose.Schema;

var Post = new Schema({
	author: String,
	picture: String,
	contents: String,
	date: Date,
	like: Number,
	comments: Array
});

var postModel = mongoose.model('Post', Post);

var check_user = function(req){
	var answer; 
	
	if(req.session.passport === undefined || req.session.passport.user === undefined){  // 비로그인유저일때
		console.log('로그인이 필요함');
		return false;
	}
	else{  // 로그인 되어 있을때
		return true;
	}
};

router.use(passport.initialize());
router.use(passport.session());


/* GET home page. */
router.get('/', function(req, res, next) {
	if(req.user){
		var name = req.user.displayName;
		var picture = req.user._json.image.url;
		res.render('index', { name: name, picture: picture });
	}
	else {
		res.render('index', { name: '비로그인 유저', picture: '/images/user.png' });
	}
});

router.get('/login', function(req, res, next) {
	res.render('login');
});

router.get('/load', function(req, res, next) {
  postModel.find({}, function(err,data){
	  res.json(data);
  });
});

router.post('/write', function(req, res, next) {
	var author = req.body.author;
	var picture = req.body.picture;
	var contents = req.body.contents;
	var date = Date.now();
	var post = new postModel();
	
	post.author = author;
	post.picture = picture;
	post.contents = contents;
	post.date = date;
	post.like = 0;
	post.comments = [];
	post.save(function (err) {
		if (err) {
			throw err;
		}
		else {
			res.json({status: "SUCCESS"});
		}
	});
});

router.post('/like', function(req, res, next) {
	var _id = req.body._id;
	var contents = req.body.contents;
	postModel.findOne({_id: _id}, function(err,post) {
		if(err){
			throw err;
		}
		else{
			post.like++;
			
			post.save(function(err) {
				if(err){
					throw err;
				}
				else{
					res.json({status: "SUCCESS"});
				}
			});
		}
	});
});

router.post('/del', function(req, res, next) {
	var _id = req.body._id;
	
	if(check_user(req)){
	   postModel.deleteOne({_id: _id}, function(err, result) {
			if(err){
				throw err;
			}
			else{
				res.json({status: "SUCCESS"});
			}
		});
	}
});

router.post('/modify', function(req, res, next) {
	var _id = req.body._id;
	var contents = req.body.contents;
	
	if(check_user(req)){
		postModel.findOne({_id: _id}, function(err, post) {
			if(err){
				throw err;
			}
			else{
				post.contents = contents;
				post.save(function(err) {
					if(err){
						throw err;
					}
					else{
						res.json({status: "SUCCESS"});
					}
				});
			} 
		});
	}
});

router.post('/comment', function(req, res, next) {
	var _id = req.body._id;
	var author = req.body.author;
	var comment = req.body.comment;
	var date = Date.now();
	
	postModel.findOne({_id: _id}, function(err, post) {
		if(err){
			throw err;
		}
		else{
			post.comments.push({author: author, comment: comment, date: date});
			post.save(function(err) {
				if(err){
					throw err;
				}
				else{
					res.json({status: "SUCCESS"});
				}
			});
		}
	});
});

passport.serializeUser(function(user, done) {
	done(null, user);
});

passport.deserializeUser(function(obj, done) {
	done(null, obj);
});

passport.use(new GoogleStrategy({
		clientID: "클라이언트 ID 입력",
		clientSecret: "클라이언트 보안 비밀 입력",
		callbackURL: "/auth/google/callback"
	}, 
	function(accessToken, refreshToken, profile, done) {
		process.nextTick(function(){	
			return done(null, profile);
		});
	}
));

router.get('/auth/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login'] }));

router.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), 
		  function(req, res) {
			res.redirect('/');
});

router.get('/logout', function(req, res){
	req.logout();
	res.redirect('/');
});

module.exports = router;
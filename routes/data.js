
var express = require('express');
var router = express.Router();//need to include express so that we can use the Router() method
var fs = require('fs');
var projects_Database = require('../config/projects-database');

router.get('/retrieveProjectPics', function(req, res, next){
	fs.readFile('./imageFile.json', function (err, data) {
	  if (err) throw err;
	  else{
			res.send(data);
		}
	});
});

router.get('/retrieveCourses', function(req, res, next){
	fs.readFile('./coursesFile.json', function (err, data) {
	  if (err) throw err;
	  else{
			res.send(data);
		}
	});
});

/*
This route will insert the comment sent from the user to Cloduant blog_db
*/
router.post('/upload', function(req, res, next){
	console.log('The request is ' + JSON.stringify(req.body));
	projects_Database.insertDocument(req.body, req.body.projectName);
});


router.post('/uploadDocs', function(req, res, next){
	fs.readFile('./public/images/calculator.jpg', function(err, data) {
	  if (!err) {
			req.body.att = {
					'name' : 'calculator.jpg',
					'data' : data,
					'content_type' : 'image/jpg'
	  	};
			//console.log(JSON.stringify(req.body));
			projects_Database.insertDocWithAttachment(req.body.projectName, req.body.att);
		};
	});
});

router.post('/document', function(req, res, next){
  projects_Database.getDocument(req.body.id, function(err, body){
		if(err){
			console.log(err);
			return;
		}
		var document = {
			'projectName' : body.projectName,
			'projectUrl' : body.projectUrl,
			'projectDescription' : body.projectDescription
		}
		res.send(document);
	});
});

module.exports = router;

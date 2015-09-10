
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

/*
This route will insert the comment sent from the user to Cloduant blog_db
*/
router.post('/upload', function(req, res, next){
	console.log('The request is ' + JSON.stringify(req.body));
	projects_Database.insertDocument(req.body, req.body.projectName);
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

var express = require('express');
var router = express.Router();//need to include express so that we can use the Router() method
var multiparty = require('multiparty');
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

/**
 * [post description]
 * @param  {[type]} '/uploadDocs' [description]
 * @param  {[type]} function(req, res,          next [description]
 * @return {[type]}               [description]
 */
router.post('/uploadDocs', function(req, res, next){
	console.log(req.body);
	var form = new multiparty.Form();
	form.parse(req, function(err, fields, files) {
		fs.readFile(files.file[0].path, function (err, data) {
		  if (err) throw err;
		  else{
				//console.log('The data from readFile is ' + JSON.stringify(data));
				var extractedData = {
					"projectName" : fields.projectName[0],
					"projectUrl" : fields.projectUrl[0],
					"projectDescription" : fields.projectDescription[0]
				}

				var extractedFile = {
					"fileName" : files.file[0].originalFilename,
					"file" : data,
					"fileType" : fields.imageType[0]
				}
				projects_Database.insertDocWithAttachment(extractedData, extractedFile);
			}
		});
	});
});

/*
 Using getDocument optional next function to be able to get back the body!
 In this case the body is the documents!
 */
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

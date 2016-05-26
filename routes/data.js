var express = require('express');
var router = express.Router();//need to include express so that we can use the Router() method
var multiparty = require('multiparty');
var fs = require('fs');
var projects_Database = require('../config/projects-database');
var loginCredentials  = require('../config/loginCredentials.json').credentials;
var loggedinCode = require('../config/loggedInCode.json').code;

router.post('/login', function(req, res){
	var email = req.body.email;
	var password = req.body.password;
	res.send(((email === loginCredentials.email) && (password === loginCredentials.password)) ? loggedinCode : null);
});

/**
 *  router.get
 * @param  {path} '/retrieveProjectPics' path to get project images from imageFile.json
 * @param  {function} req == get request. and res == response that will be returned
 * @return {object}  res will send the content of imageFile.json in the form of data
 * NOTE: In siteM this route was used in projectsController.js
 */
router.get('/retrieveProjectPics', function(req, res, next){
	fs.readFile('./imageFile.json', function (err, data) {
	  if (err) throw err;
	  else{
			res.send(data);
		}
	});
});

/**
 *  router.get
 * @param  {path} '/retrieveCourses' path to get courses from coursesFile.json
 * @param  {function} req == get request. and res == response that will be returned
 * @return {object}  res will send the content of coursesFile.json in the form of data
 * NOTE: In siteM this route was used in coursesController.js
 */
router.get('/retrieveCourses', function(req, res, next){
	fs.readFile('./coursesFile.json', function (err, data) {
	  if (err) throw err;
	  else{
			res.send(data);
		}
	});
});

/**
 * router.post
 * @param  {path} '/upload' is the path to upload a document to blog_db
 * @param  {function} req == request to post contains the content that the client
 * wants to insert to the blog_db. The res == response; nothing in this case
 * @return {none}
 * NOTE: This route was not used in siteM
 */
router.post('/upload', function(req, res, next){
	console.log('The request is ' + JSON.stringify(req.body));
	projects_Database.insertDocument(req.body, req.body.projectName);
});

/**
 * router.post
 * @param  {path} '/uploadDocs' is the path to upload documents that have attachments
 * to blog_db
 * @param  {function} req == post request containing the document & attachment wanted to insert
 *                    res == response that blog_db returns
 * @return {object}   either an err object == failed or body object == successfull
 * NOTE: In siteM this route was used in adminController.js
 */
router.post('/uploadDocs', function(req, res, next){
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
				projects_Database.insertDocWithAttachment(extractedData, extractedFile, function(err, body){
					if(err){
						res.send(err);
					}
					res.send(body);
				});
			}
		});
	});
});

/**
 * router.post
 * @param  {path} '/document' is the path to retrieve a document from blog_db
 * @param  {function} req == post request that contains a docName of the document
 *         in blog_db that the cient wants to retrieve
 * @return {object}  res sends back 'document' object obtained from blog_db
 * NOTE This route was never used in blog_db
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
/**
 * router.post
 * @param  {path} '/documentWithAttachment' [description]
 * @param  {function} req == post request whicn contains docName to retrieve
 * desired document with attachment
 * res == resonse from blog_db. Returns the document and attachment
 * @return {object} returns body that contains the document & attachment from
 * blog_db
 * NOTE This route was used in projectsController.js
 */
router.post('/documentWithAttachment', function(req, res, next){
  projects_Database.getDocumentWithAttachment(req.body.id, function(err, body){
		if(err){
			console.log(err);
		}
		res.send(body);
	});
});

module.exports = router;

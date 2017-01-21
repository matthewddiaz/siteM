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
 * wants to insert to the projects_Database. The res == response; nothing in this case
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
 * @param  {function} req == post request containing the document & attachment(s) wanted to insert
 *                    res == response that projects_Database returns
 * @return {object}   either an err object == failed or body object == successfull
 * NOTE: In siteM this route was used in adminController.js
 */
router.post('/uploadDocs', function(req, res, next){
	var form = new multiparty.Form();
	form.parse(req, function(err, fields, files) {
		var filesArray = files.file;
		/**
		 * readFile returns a new Promise, if resolved returns the file created from
		 * reading data from the file's path asychronously.
		 * @param  {Object} file [json object that contains fileName, filePath;
		 *                       but is not the actual file]
		 * @return {Promise}      [this promise object if resolved returns the actual file]
		 */
		function readFile(file){
			return new Promise(function(resolve, reject){
				fs.readFile(file.path, function(err, fileBuffer){
					if(err){
							reject(err);
					}
					console.log(Buffer.isBuffer(fileBuffer));
					var fileBufferAndInformation = {
						name : file.originalFilename,
						data : fileBuffer
					};

					resolve(fileBufferAndInformation);
				});
			});
		};

		//creating an array of Promises to be fulfilled.
		//allows for asynchronous tasks to be handled more easy
		//especially knowing when they all have terminated.
		//NOTE: Array.map(function()) in this case we are calling readFile(file)
		//function defined above this line.
		var fileUploadsPromises = filesArray.map(readFile);

		/**
		 * [Promise.all is a class method of Promise ES6 and executes all Promises]
		 * @param  {Array} fileUploadsPromises [array of Promises]
		 * @return {Promise}                     [that either fulfilled if all Promises
		 *                                        in fileUploadsPromises fulfilled or reject
		 *                                        if at least 1 Prmose in fileUploadsPromises
		 *                                        got rejected]
		 */
		Promise.all(fileUploadsPromises)
				.then(function(uploadedFilesArray){
					/**
					*	format attachments to send to insertDoc
					* nanoJS requires that attachments be an Array of objects
					* Object follow the following order
					* object = {
					*		name : myObj,
					*	 data : myData,
					*	 content_type : png
					*	}
					*/
					uploadedFilesArray[0]['content_type'] = fields.frontPhotoFileType.toString();
					uploadedFilesArray[1]['content_type'] = fields.popUpPhotoFile.toString();

					var extractedData = {
						"projectName" : fields.projectName[0],
						"projectUrl" : fields.projectUrl[0],
						"projectDescription" : fields.projectDescription[0]
					}

					projects_Database.insertDocWithAttachment(
						extractedData, uploadedFilesArray,
						function(err, body){
							if(err){
								res.send(err);
							}
							res.send(body);
					});
				}).catch(function(err) {
					// Will catch failure of first failed promise. This will happen if
					// any of the Promises from fileUploadsPromises get rejected
					console.log("Failed: ", err);
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
 *This route returns a list of all the projects in projects_Database
 *NOTE: projects do not come with their attachment included.
 * @param  {route} '/allDocuments'   [description]
 * @param  {function} function(request, response,     next [description]
 * @return {object}   listOfProjects
 */
router.get('/allDocuments', function(request, response, next){
	projects_Database.getAllDocuments(function(err, listOfProjects){
		if(err){
			console.log(err);
			response.send(err);
		}
			response.send(listOfProjects);
	});
});

/**
 * This route returns the full list of all projects in projects_database.
 * Each project comes with their attachment included.
 * @param  {path} '/allDocumentswithAttachments' [description]
 * @param  {function} response sends back all documents with their attachments
 * @return {object} projects
 */
router.get('/allDocumentsWithAttachments', function(request, response, callback){
	projects_Database.getAllDocumentsWithAttachments(function(err, projects){
		if(err){
			console.log(err);
			response.send(err);
		}
			response.send(projects);
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
	var documentID = req.body.id;
  projects_Database.getDocumentWithAttachment(documentID, function(err, body){
		if(err){
			console.log(err);
		}
		res.send(body);
	});
});

router.post('/documentAttachment', function(req, res, callback){
	var attachmentDetails = req.body;
	projects_Database.getDocumentAttachment(attachmentDetails, function(err, buffer){
		if(err){
			console.log(err);
		}
		res.send(buffer);
	});
});

module.exports = router;

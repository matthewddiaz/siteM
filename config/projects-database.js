var cloudantCredentials = require('./database.json').credentials;
var crypto = require('crypto');
var multiparty = require('multiparty');
var utils = require('../utils/utils');

var cloudant = {
  url: cloudantCredentials.url
};

if (process.env.hasOwnProperty("VCAP_SERVICES")) {
  // Running on Bluemix. Parse out the port and host that we've been assigned.
  var env = JSON.parse(process.env.VCAP_SERVICES);
  var host = process.env.VCAP_APP_HOST;
  var port = process.env.VCAP_APP_PORT;

  // Also parse out Cloudant settings.
  cloudant = env['cloudantNoSQLDB'][0].credentials;
}

var nano = require('nano')(cloudant.url);
var db = nano.db.use(cloudantCredentials.projectsDatabase);

function encryptID(id) {
  return crypto.createHash('sha256').update(id).digest('hex');
};

/**
* insertDocument function inserts a document to blog-db
* @param  {object} doc is the object that will be inserted
* @param  {string} doc_id is the intended document name.
* NOTE can be used for retrieval of document
* @return {none}
*/
function insertDocument(doc, doc_id){
  var id = encryptID(doc_id);

  //NOTE function defined by descape/nano github
  db.insert(doc , id, function(err,body){
    if(err){
      console.log("Could not insert to " + cloudantCredentials.projectsDatabase);
    }else{
      console.log("Document was inserted successfully to " + cloudantCredentials.projectsDatabase);
    }
  });
}
exports.insertDocument = insertDocument;

/**
* insertDocWithAttachment function that inserts a document with an attachment
* to blog-dev
* @param  {object}   doc is an object that contains the document information
* @param  {attachments}   attachments is an object that contains the attachment information
* @param  {Function} next is a callback function that returns an error and body
* @return {object}  Either body or error depeding on insertion result
*/
function insertDocWithAttachment(doc, attachments){
  var docID = encryptID(doc.projectName);
  //NOTE this function with its parameters is defined by nano js
  return new Promise(function(resolve, reject){
    db.multipart.insert(doc, attachments, docID, function(err, body) {
      if(err){
        reject("Could not insert to " + cloudantCredentials.projectsDatabase + err);
      }else{
        console.log("Document with attachment was successfully inserted to " +
        cloudantCredentials.projectsDatabase);
        resolve(body);
      }
    });
  });
}
exports.insertDocWithAttachment = insertDocWithAttachment;

/**
* getDocument will get a document from blog-db using doc_ib
* @param  {string}   doc_id is the docName of the document in blog-db
* @param  {Function} next is the callback function with an err or body object
* @return {object}   body is the object that blog_db returns
*/
function getDocument(doc_id, next){
  var id = encryptID(doc_id);

  //NOTE function defined by descape/nano github
  db.get(id, function(err, body) {
    if(err){
      console.log('An error occurred while getting document ' + err);
      console.log(body);
    }
    next(err, body);
  });
}
exports.getDocument = getDocument;

/**
* getAllDocuments function that gets all of the objects in the
* database at the same time
* @param  {Function} next callback function
* @return {object}  either an err object or body containing all of the documents
* in blog_db
*/
function getAllDocuments(callback){
  //NOTE using an arbitrary key retrieves all Docs info from database
  var arbitraryKey = {
    secret : "code"
  }
  //NOTE function defined by descape/nano github
  db.fetch(arbitraryKey,function(err, allDocsInfo) {
    if(err){
      console.log('Could not retrieve document information from '
      + cloudantCredentials.projectsDatabase);
    }
    callback(err, allDocsInfo);
  });
}
exports.getAllDocuments = getAllDocuments;

/**
* getDocumentAttachment function gets attachment of a document as a buffer
* @param {documentName}
* @param {attachmentName}
* @return {Promise}  either an err object or base64 string
*
*/
function getDocumentAttachment(documentName, attachmentName){
  return new Promise(function(resolve, reject){
    db.attachment.get(documentName, attachmentName, function(err, attachmentBuffer){
      if(err){
        reject(err);
      }
      resolve(attachmentBuffer);
    });
  });
}
exports.getDocumentAttachment = getDocumentAttachment;

/**
* This method will send a request to the helper site to retrieve
* the list of all the projects in the database in reverse order
* by their lastCommit attribute
* @return {Promise} this Promise object can their be fulfilled (if request is successful)
*                   or rejected (if error with request)
*/
function getAllProjectsSortedByLastCommit(){
  var requestObject = {
    url:  'http://matthewddiazhelper.mybluemix.net' + '/data/allDocsSortedByCommit',
    method : "GET",
    headers: {
      'User-Agent': "siteM"
    },
    options: {
      'content-type' : 'application/json'
    }
  };
  return utils.makeHttpRequest(requestObject);
}

/**
* Creates a json object decodedProject with project information ready
* for the front end to read. Then for each attachment image the document
* has calls an async task getDocumentAttachment to acquire the attachment
* as a buffer. Once complete the image buffers are added to the decodedProject
* object as attributes.
* @param  {JSON} project this is the partial project though does not contain the
*                        full attachments
* @return {Promise}      This promise if fulfilled will it return the complete
*                        decodedProject; if reject return an error
*/
function retrieveCompleteProject(project){

  return new Promise(function(resolve, reject){
    var projectObject = project.value;

    var lastCommitDate = projectObject.lastCommit;
    if(utils.checkObjectType(lastCommitDate) === "[object String]"){
      lastCommitDate = new Date(lastCommitDate);
    }
    var lastCommitDateFormatted = lastCommitDate.toLocaleDateString();

    var decodedProject = {
      projectName : projectObject.projectName,
      projectUrl : projectObject.projectUrl,
      projectDescription : projectObject.projectDescription,
      lastCommit : lastCommitDateFormatted
    };

    var attachments = projectObject._attachments;
    var attachmentsNames = Object.keys(attachments);

    var decodedImagesPromises = attachmentsNames.map(function(attachmentName){
      return getDocumentAttachment(projectObject._id, attachmentName);
    });

    Promise.all(decodedImagesPromises)
    .then(function(bufferedImagesArray){
      decodedProject['frontDisplayPhoto'] = bufferedImagesArray[0].toString('Base64');
      decodedProject['popUpInfoPhoto'] = bufferedImagesArray[1].toString('Base64');
      resolve(decodedProject);
    }).catch(function(err){
      reject(err);
    });
  });
}

/**
* This method given a list of all partial projects tries to generate the complete
* projects. This is done using Array.map(function()) where the function (retrieveCompleteProject)
* in this case is an  async task and returns a Promise. That is this .map() returns an Array
* of Promises decodedProjectsArrayPromises. Prmoise.all(Iterable) tries to resolve all Promises
* in the array. If all resolved in the array of completed projects is returned.
* @param  {Array} projectsArray this is an array of partial projects in JSON represented
*                               in an array.
* @return {Promise}             if this promise is fulfilled will return the full list
*                               of complete projects; else rejected error.
*/
function generateCompleteProjects(projectsArray){
  if(utils.checkObjectType(projectsArray) === "[object String]"){
    projectsArray = JSON.parse(projectsArray);
  }
  var decodedProjectsArrayPromises = projectsArray.map(retrieveCompleteProject);
  return Promise.all(decodedProjectsArrayPromises);
}

/**
* getDocumentsWithAttachments gets all documents along with their attachments using docName
* @return {object}   returns either a err or docAndAtt object
*/
function getAllDocumentsWithAttachments(){
  return getAllProjectsSortedByLastCommit().then(generateCompleteProjects);
}
exports.getAllDocumentsWithAttachments = getAllDocumentsWithAttachments;

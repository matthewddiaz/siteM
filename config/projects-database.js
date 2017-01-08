var cloudantCredentials = require('./database.json').credentials;
var crypto = require('crypto');
var multiparty = require('multiparty');
var request = require('request');

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
        console.log("Could not insert to blog_db");
    }else{
      console.log("Blog was inserted successfully to blog_db!");
     }
  });
}
exports.insertDocument = insertDocument;

/**
 * insertDocWithAttachment function that inserts a document with an attachment
 * to blog-dev
 * @param  {object}   doc is an object that contains the document information
 * @param  {att}   att is an object that contains the attachment information
 * @param  {Function} next is a callback function that returns an error and body
 * @return {object}  Either body or error depeding on insertion result
 */
function insertDocWithAttachment(doc, att, next){
  var id = encryptID(doc.projectName);

  //NOTE this function with its parameters is defined by nano js
  db.multipart.insert(doc,
   [{name: 'image', data: att.file, content_type: att.fileType}],
   id, function(err, body) {
      if(err){
          console.log("Could not insert to blog_db " + err);
      }else{
        console.log("Blog with documents was inserted successfully to blog_db!");
      }
      next(err, body);
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
 * @param  {Function} callback callback function
 * @return {string}  either an err object or base64 string
 *
 */
function getDocumentAttachment(documentName, attachmentName, callback){
  db.attachment.get(documentName, attachmentName, function(err, attachmentBuffer){
    if(err){
      console.log("Error while retrieving attachment");
    }

    callback(err, attachmentBuffer);
  });
}
exports.getDocumentAttachment = getDocumentAttachment;

/**
 * getDocumentsWithAttachments gets all documents along with their attachments using docName
 * @param  {Function} callback is the callback function that returns an err and the documents array
 * @return {object}   returns either a err or docAndAtt object
 */
function getAllDocumentsWithAttachments(callback){
  //retrieve all documents brief descriptions
  getAllDocuments(function(err, allDocsInfo){
    if(err){
      console.log(err);
    }

    var projectInfoArr = allDocsInfo.rows;
    var totalNumOfProjects = allDocsInfo.total_rows;

    function retrieveCompleteProject(partialProject){
      var projectDocs = partialProject.doc;
      var projectID = partialProject.id;
      var attachmentName = 'image';
      return new Promise(function(resolve, reject){
        getDocumentAttachment(projectID, attachmentName, function(err, attachment){
          if(err){
            reject(err);
          }

          var completeProjectDescription = {
              projectName : projectDocs.projectName,
              projectDescription : projectDocs.projectDescription,
              projectUrl : projectDocs.projectUrl,
              projectImage : attachment.toString('Base64')
          };
          resolve(completeProjectDescription);
        });
      });
    };

    var projectDocs = projectInfoArr.map(retrieveCompleteProject);
    Promise.all(projectDocs)
        .then(function(result){
          callback(err, result);
        }).catch(function(err) {
          // Will catch failure of first failed promise
          console.log("Failed:", err);
        });
  });
}
exports.getAllDocumentsWithAttachments = getAllDocumentsWithAttachments;

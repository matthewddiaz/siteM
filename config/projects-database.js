var cloudantCredentials = require('./database.json').credentials;
var crypto = require('crypto');
var multiparty = require('multiparty');

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
var db = nano.db.use('matt_projects');

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
    }
    next(err, body);
  });
}
exports.getDocument = getDocument;

/**
 * getDocumentWithAttachment gets a document along with its attachment using docName
 * @param  {string}   doc_id is the docName of the document with attachment
 * @param  {Function} next is the callback function that returns an err and document object
 * @return {object}   returns either a err or docAndAtt object
 */
function getDocumentWithAttachment(doc_id, next){
  var id = encryptID(doc_id);

  //NOTE function defined by descape/nano github
  db.multipart.get(id, function(err, buffer) {
    if (err){
      console.log('An error occurred while getting document ' + err);
    }
    //projectAtt is the actual image
    //
    if(buffer){//protecting app if database is down. only returns docAndAtt if buffer is not undefined!
      var docAndAtt = {
        "projectName" : buffer.projectName,
        "projectUrl" : buffer.projectUrl,
        "projectDescription" : buffer.projectDescription,
        "projectAtt" : buffer._attachments.image.data
      }
      next(err, docAndAtt);
    }else{
      console.log("The database result is undefined");
    }


  });
}
exports.getDocumentWithAttachment = getDocumentWithAttachment;

/**
 * getAllDocuments function that gets all of the objects in the
 * database at the same time
 * @param  {Function} next callback function
 * @return {object}  either an err object or body containing all of the documents
 * in blog_db
 */
function getAllDocuments(next){
  var fakeKey = {
    blog : "blog"
  }
  //NOTE function defined by descape/nano github
  db.fetch(fakeKey,function(err, body) {
    if(!err){
      //Extracting the documents from the returned body
      rows = body.rows;

      //Array called blogs will have an JSON object of what is returned!
      var blogs = rows.map(function(row){
        return {
          blog : row.doc.comment,
          time : row.doc.time_posted
        }
      });
       next(err, blogs);
    }
  });
}

exports.getAllDocuments = getAllDocuments;

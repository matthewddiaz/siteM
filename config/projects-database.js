
var cloudantCredentials = require('./db-credentials.json').credentials;
var crypto = require('crypto');

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
var db = nano.db.use('blog_db');

function encryptID(id) {
  return crypto.createHash('sha256').update(id).digest('hex');
};

/* Insert a blog to cloudant database blog_db
 * using nano module and function insert.
 * first parameter object
 * second parameter is callback function
 */
function insertDocument(doc, doc_id){
  var id = encryptID(doc_id);

  db.insert(doc , id, function(err,body){
    if(err){
        console.log("Could not insert to projects_db");
    }else{
      console.log("Blog was inserted successfully to projects_db!");
     }
  });
}
exports.insertDocument = insertDocument;

function insertDocWithAttachment(doc, att, next){
  var id = encryptID(doc.projectName);

  db.multipart.insert(doc,
   [{name: att.fileName, data: att.file, content_type: att.fileType}],
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

//db.get(docname, [params], [callback])
function getDocument(doc_id, next){
  var id = encryptID(doc_id);

  db.get(id, function(err, body) {
    if(err){
      console.log('An error occurred while getting document ' + err);
    }
    next(err, body);
  });
}
exports.getDocument = getDocument;

function getDocumentWithAttachment(doc_id, next){
  var id = encryptID(doc_id);

  db.multipart.get(id, function(err, buffer) {
    if (err){
      console.log('An error occurred while getting document ' + err);
    }
    console.log(buffer.toString());

    next(err, body);
  });
}
exports.getDocumentWithAttachment = getDocumentWithAttachment;

/* Get all previous blogs stored in the blog_db
 * nano fetch method requires a key. If the key does
 * not match a unique ID in the database, fetch will return
 * everything. Note: the attribute should be called keys.
 *
 *next refers to a callback that a user will include
 */


/* Next is the optional callback function that returns an error
 * if any and a JSON body.
 *
 */
function getAllDocuments(next){
  var fakeKey = {
    blog : "blog"
  }
  db.fetch(fakeKey,function(err, body) {
    if(!err){
      //The extracting the blogs from the returned body
      rows = body.rows;

      //creating an array called blog that will have a JSON elements
      //of whtat is returned!
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

var cloudantCredentials = require('./database.json').credentials;
var Cloudant = require('cloudant');

var account_name = cloudantCredentials.username;
var account_password = cloudantCredentials.password;

var cloudant = Cloudant({account: account_name, password : account_password});

var projectDatabase = cloudant.db.use(cloudantCredentials.projectsDatabase);

function getAllDatabases(){
  cloudant.db.list(function(error, allDataBases){
    console.log('Hey guys');
    console.log('All my databases: %s', allDataBases.join(', '));
  });
}
exports.getAllDatabases = getAllDatabases;

function getAllDocs(){
  var fakeKey = {
    secret : "code"
  }
  //NOTE function defined by descape/nano github
  projectDatabase.fetch(fakeKey,function(err, body) {
    if(!err){
      //Extracting the documents from the returned body
      rows = body.rows;
      //console.log(body);
      //Array called blogs will have an JSON object of what is returned!
      var projects = rows.map(function(row){
        return {
          doc : row.doc
        }
      });
      console.log(projects);
      //  next(err, blogs);
    }
  });
}

exports.getAllDocs = getAllDocs;

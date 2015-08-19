
var cloudantCredentials = require('./db-credentials.json').credentials;

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


/* Insert a blog to cloudant database blog_db 
 * using nano module and function insert.
 * first parameter object
 * second parameter is callback function
 */
function insertBlog(blog){
  db.insert(blog , function(err,body){
    if(err){
        console.log("Could not insert to blog_db");
    }else{
      console.log("Blog was inserted successfully to blog_db!");
     }
  });
}

/*This line exports insertBlog() so that another file can use this function.
  Requires it using
  var blogDB = require('.../blog-database');

  To use the function you need to do the following
  blogDB.insertBlog()
*/
exports.insertBlog = insertBlog;

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
function getBlogs(next){
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
      //console.log(blogs);
       next(err, blogs);
    }    
  });
}

exports.getBlogs = getBlogs;
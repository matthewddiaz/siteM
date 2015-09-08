
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
router.post('/upload',function(req, res, next){
	projects_Database.insertBlog(req.body);
});

/*
	function(code) {
		return crypto.createHash('sha256').update(code).digest('hex');
	};
	var id = function('mycode');

*/


router.get('/history',function(req, res, next){

  /* the function for getBlogs is the next callback
   * function from blog-database.js method
   * getBlogs
   */
  projects_Database.getBlogs(function(err, blogs){
    if(err){
      console.log('hi you messed up!');
    }else{
      console.log(blogs);
      res.send(blogs);
    }
  });

});


module.exports = router;

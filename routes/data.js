
var express = require('express');
var router = express.Router();//need to include express so that we can use the Router() method

var blog_Database = require('../config/blog-database');

/*
This route will insert the comment sent from the user to Cloduant blog_db
*/
router.post('/comment',function(req, res, next){
	console.log(req.body);
	blog_Database.insertBlog(req.body);
});


router.get('/history',function(req,res,next){
  
  /* the function for getBlogs is the next callback 
   * function from blog-database.js method 
   * getBlogs
   */
  blog_Database.getBlogs(function(err, blogs){
    if(err){
      console.log('hi you messed up!');
    }else{
      console.log(blogs);
      res.send(blogs);
    }
  });
  
});


module.exports = router;

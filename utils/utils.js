var exports = module.exports = {};
var request = require('request-promise');

exports.makeHttpRequest = function(requestOption){
  return new Promise(function(resolve, reject){
    request(requestOption)
      .then(function(response){
        resolve(response);
      }).catch(function(error){
        reject(error);
      });
  });
}

/**
 * checks the type of an object
 * @param  {Object} object which we do not now the type of
 * @return {String} the String tells the program what type of object the input is
 */
exports.checkObjectType = function(object){
  return Object.prototype.toString.call(object);
};

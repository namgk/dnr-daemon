var should = require("should");
var clone = require("clone");

// var nrAdmin = require('../node-red-admin');
var utils = require('./test_util');
var testData = require('./dnr_test_data');

var http = require('http');
var config = require('../src/config');

describe("dnr node red api tests", function() {
  
  var backupFlows;
  
  before(function (done) {
    console.log('backing up');
     utils.httpGet(config.LOCAL_NODERED + '/flows', function(res){
       if (res){
         backupFlows = res;
         done();
       } else {
         throw new Error('local node red not found');
       }
     });
  });
  
  after(function(done) {
    console.log('putting things back!');
    utils.httpPost(config.LOCAL_NODERED + '/flows', backupFlows, function(res){
      console.log(res);
      done();
    })
  });
  
  describe('deploying flow api test', function(){
    it('deploy new flows to local Node-RED process', function(){
      var deployingFlows = testData.test10;
    })
  });
  
  describe('posting flow api test', function(){
    it('post a new flow to local Node-RED process', function(){
      
    })
  });
  
  describe('deleting flow api test', function(){
    it('delete an existing flow of local Node-RED process', function(){
    })
  });
});
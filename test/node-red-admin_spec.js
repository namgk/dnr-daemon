var should = require("should");
var clone = require("clone");

var nrAdmin = require('../node-red-admin');
var utils = require('./test_util');
var testData = require('./dnr_test_data');

var http = require('http');
var settings = require('../settings');

describe("dnr node red api tests", function() {
  
  var backupFlows;
  
  before(function (done) {
    console.log('backing up');
     utils.httpGet(settings.localNodeRED + '/flows', function(res){
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
    utils.httpPost(settings.localNodeRED + '/flows', backupFlows, function(res){
      console.log(res);
      done();
    })
  });
  
  describe('deploying flow api test', function(){
    it('deploy new flows to local Node-RED process', function(){
      var deployingFlows = testData.test10;
      nrAdmin.deployFlows(deployingFlows);
      
      // http.get(settings.localNodeRED + '/flows', function(response) {
      //   var str = '';
      
      //   response.on('data', function (chunk) {
      //     str += chunk;
      //   });
      
      //   response.on('end', function () {
      //     str.should.be.equal(JSON.stringify(deployingFlows));
      //   });
      // });
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
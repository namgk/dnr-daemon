var http = require("http");
var https = require("https");
var urllib = require("url");

var httpGet = function(url, cb){
  var options = {
      host : url
  };
  
  ((/^https/.test(url))?https:http).get(url, function(res) {
    var result = '';
    res.on('data',function(chunk) {
      result += chunk;
    });
    res.on('end',function() {
      cb(result);
    });
  }).on('error', function(e) {
      console.log("Got error: " + e.message);
      cb(null);
  }).end();
  
}

var httpPost = function(url, payload, cb){
  if (typeof payload !== 'string'){
    return;
  }
  
  // var payload = JSON.stringify(payload);
  var opts = urllib.parse(url);
  opts.headers = {
    'content-type':'application/json', 
    'content-length': payload.length,
    'Node-RED-Deployment-Type': 'full'
  };
  opts.method = 'POST';

  var req = ((/^https/.test(url))?https:http).request(opts,function(res) {
    console.log(res.statusCode);
    var result = '';
    res.on('data',function(chunk) {
        result += chunk;
    });
    res.on('end',function() {
        cb(result);
    });
  });

  req.on('error',function(err) {
    cb(null);
  });

  if (payload)
    req.write(payload);

  req.end();
}

var compareFlows = function(newFlows, expectedFlows){
  newFlows.should.be.an.Array.with.lengthOf(expectedFlows.length);
  var expectedTabs = [];
  var expectedSubflows = [];
  var expectedSubflowsExt = [];
  var expectedNodes = [];
  
  for (var i = 0; i < expectedFlows.length; i++){
    if (expectedFlows[i].type === 'tab'){
      expectedTabs.push(expectedFlows[i]);
    } else if (expectedFlows[i].type === 'subflow'){
      expectedSubflows.push(expectedFlows[i]);
    } else if (expectedFlows[i].type.indexOf('subflow:') == 0){
      expectedSubflowsExt.push(expectedFlows[i]);
    } else {
      expectedNodes.push(expectedFlows[i]);
    }
  }
  
  var tabs = [];
  var subflows = [];
  var subflowsExt = [];
  var nodes = [];
  
  for (var i = 0; i < newFlows.length; i++){
    if (newFlows[i].type === 'tab'){
      tabs.push(newFlows[i]);
    } else if (newFlows[i].type === 'subflow'){
      subflows.push(newFlows[i]);
    } else if (newFlows[i].type.indexOf('subflow:') == 0){
      subflowsExt.push(newFlows[i]);
    } else {
      nodes.push(newFlows[i]);
    }
  }
  
  tabs.length.should.equal(expectedTabs.length, 'number of tabs should match old number of tabs + 1');
  subflows.length.should.equal(expectedSubflows.length, 'number of subflows should match');
  subflowsExt.length.should.equal(expectedSubflowsExt.length, 'number of subflowsExt should match');
  nodes.length.should.equal(expectedNodes.length, 'number of nodes should match');
  
};
  
  module.exports = {
   compareFlows: compareFlows,
   httpGet: httpGet,
   httpPost: httpPost
  }
var clone = require("clone");
var http = require("follow-redirects").http;
var https = require("follow-redirects").https;
var urllib = require("url");

var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://test.mosquitto.org');

var settings = require('./config');
var nodeFactory = require('./nodeFactory');
var utils = require('./utils');

var DEVICE_ID = settings.DEVICE_ID;
var LOCAL_NODERED = settings.LOCAL_NODERED;

client.on('connect', function () {
  console.log('DEBUG: DNR Daemon subscribing to "dnr-new-flows"')
  client.subscribe('dnr-new-flows');
});

client.on('message', function (topic, message) {
  var flowsUrl = message.toString();
  console.log('DEBUG: downloading config from ' + flowsUrl);
  downloadConfig(flowsUrl, function(config){
    console.log('DEBUG: redeploying config to ' + LOCAL_NODERED);
    var dnrizedConfig = dnrizeConfig(JSON.parse(config));
    console.log(JSON.stringify(dnrizedConfig));
    redeployConfig(dnrizedConfig, LOCAL_NODERED + '/flows');
  })
});

//TODO: ignore dnr wires
function extractReverseWires(config){
  var reverseWires = {};

  for (var j = 0; j < config.length; j++){
    var node = config[j];

    if (!node.wires)
      continue;

    for (var i = 0; i < node.wires.length; i++){
      for (var k = 0; k < node.wires[i].length; k++){
        if (!reverseWires[node.wires[i][k]])
          reverseWires[node.wires[i][k]] = [];
      
        reverseWires[node.wires[i][k]].push(node);
      }
    }
  }

  return reverseWires;
}

function extractForwardWires(config){
  var forwardWires = {};

  for (var j = 0; j < config.length; j++){
    var node = config[j];

    if (!node.wires)
      continue;


    for (var i = 0; i < node.wires.length; i++){
      var outputI = node.wires[i];//will be an array of sub outputs

      var subOutput = [];

      for (var k = 0; k < outputI.length; k++){
        subOutput.push(outputI[k]);
      }

      if (subOutput.length < 0)
        continue;

      if (!forwardWires[node.id])
        forwardWires[node.id] = [];

      forwardWires[node.id].push(subOutput);
    }    
  }

  return forwardWires;
}

function dnrizeConfig(_config){
  var config = clone(_config);

  var newDnrs = [];
  var dnrnodes = {};
  var reverseWires = extractReverseWires(config);
  var forwardWires = extractForwardWires(config);

  for (var j = 0; j < config.length; j++){
    var node = config[j];
    if (node.constraints && !satisfyConstraints(node.constraints) && Object.keys(node.constraints).length != 0){
      // replace with DNRNode
      node.type = 'dnr';
      dnrnodes[node.id] = 1;
    }
  }
  
  for (var j = 0; j < config.length; j++){
    var node = config[j];

    if (!node.hasOwnProperty('constraints') || Object.keys(node.constraints).length == 0)
      continue;

    if (dnrnodes[node.id])
      continue;

    var nodeInputs = reverseWires[node.id] || [];
    var nodeOutputs = forwardWires[node.id] || [[]];

    for (var i = 0; i < nodeInputs.length; i++){
      if (dnrnodes[nodeInputs[i].id])
        continue;

      for (var k = 0; k < nodeInputs[i].wires.length; k++){
        for (var m = 0; m < nodeInputs[i].wires[k].length; m++){
          if (nodeInputs[i].wires[k][m] !== node.id)
            continue;

          var newDnrIn = nodeFactory.makeDnrIn(node, k, nodeInputs[i]);
          newDnrs.push(newDnrIn);
          
        }
      }
    }

    for (var i = 0; i < nodeOutputs.length; i++){
      var outputI = nodeOutputs[i];


      for (var k = 0; k < outputI.length; k++){
        if (dnrnodes[outputI[k]])
          continue;

        var newDnrOut = nodeFactory.makeDnrOut(node, i, outputI[k]);
        newDnrs.push(newDnrOut);
      }
    }
  }

  config.push(nodeFactory.DnrComm().getBroker());// config node for mqtt

  for (var i = 0; i < newDnrs.length; i++)
    config.push(newDnrs[i]);

  return config;
}

function downloadConfig(url, cb){
  var opts = urllib.parse(url);
  opts.headers = {
    'content-type':'application/json'
  };
  ((/^https/.test(url))?https:http).get(opts, function(res){
    console.log(res.statusCode);
    var result = '';
    res.on('data',function(chunk) {
        result += chunk;
    });
    res.on('end',function() {
        cb(result);
    });
  })
}

function redeployConfig(dnrizedConfig, nrEndpoint){
  // TODO: discover this endpoint or get from settings
  var payload = JSON.stringify(dnrizedConfig);
  var opts = urllib.parse(nrEndpoint);
  opts.headers = {
    'content-type':'application/json', 
    'content-length': payload.length,
    'Node-RED-Deployment-Type': 'full'
  };
  opts.method = 'POST';

  var req = ((/^https/.test(nrEndpoint))?https:http).request(opts,function(res) {
    console.log(res.statusCode);
    var result = '';
    res.on('data',function(chunk) {
        result += chunk;
    });
    res.on('end',function() {
        console.log(result);
    });
  });

  req.on('error',function(err) {
    console.log(err);
  });

  if (payload){
    req.write(payload);
  }

  req.end();
}

function satisfyConstraints(constraints){
  // TODO: implement this logic!
  for (var c in constraints){
    if (!constraints.hasOwnProperty(c))
      continue;

    if (constraints[c].deviceId && constraints[c].deviceId === DEVICE_ID)
        return true;
  }
  return false;
}

module.exports = {
  dnrizeConfig: dnrizeConfig,
  redeployConfig: redeployConfig,
  extractReverseWires: extractReverseWires,
  extractForwardWires: extractForwardWires
}
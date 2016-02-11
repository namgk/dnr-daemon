var settings = require('./settings');
var clone = require("clone");
var http = require("follow-redirects").http;
var https = require("follow-redirects").https;
var urllib = require("url");
var mqtt = require('mqtt');
var client = mqtt.connect('mqtt://test.mosquitto.org');

client.on('connect', function () {
  console.log('DEBUG: DNR Daemon subscribing to "dnr-new-flows"')
  client.subscribe('dnr-new-flows');
});

client.on('message', function (topic, message) {
  var flowsUrl = message.toString();
  console.log('DEBUG: downloading config from ' + flowsUrl);
  downloadConfig(flowsUrl, function(config){
    redeployConfig(dnrizeConfig(JSON.parse(config)));
  })
});

function DnrComm(){
  return {
    getBroker: function(){
      return this.broker;
    },
    getMqttIn: function(){
      return this.mqttIn;
    },
    getMqttOut: function(){
      return this.mqttOut;
    },
    broker: {
      "birthPayload": "",
      "birthQos": "0",
      "birthRetain": null,
      "birthTopic": "",
      "broker": "localhost",
      "cleansession": true,
      "clientid": "",
      "compatmode": true,
      "credentials": {
          "password": "",
          "user": ""
      },
      "id": "dnr.system_node",
      "keepalive": "15",
      "port": "1883",
      "type": "mqtt-broker",
      "usetls": false,
      "verifyservercert": true,
      "willPayload": "",
      "willQos": "0",
      "willRetain": null,
      "willTopic": "",
      "z": ""
    },
    mqttIn: {
      "broker": "dnr.system_node",
      "id": "",
      "name": "",
      "topic": "",
      "type": "mqtt in",
      "wires": [[]],
      "x": 0,
      "y": 0,
      "z": ""
    },
    mqttOut: {
      "broker": "dnr.system_node",
      "id": "",
      "name": "",
      "qos": "",
      "retain": "",
      "topic": "",
      "type": "mqtt out",
      // "wires": [[]],
      "x": 0,
      "y": 0,
      "z": ""
    }
  }
}

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

function generateId(){
  return (1+Math.random()*4294967295).toString(16);
}

function makeMqttOut(node, nodeOutput, nodeOutputWire){
  var newMqttOut = DnrComm().getMqttOut();
  newMqttOut.id = 'dnr.' + generateId();
  newMqttOut.x = node.x + 20;
  newMqttOut.y = node.y + 20;
  newMqttOut.z = node.z;
  newMqttOut.topic = node.id + '-' + nodeOutput + '-' + nodeOutputWire;

  node.wires[nodeOutput].push(newMqttOut.id);

  return newMqttOut;
}

function makeMqttIn(node, nodeInputOutput, nodeInput){
  var newMqttIn = DnrComm().getMqttIn();;
  newMqttIn.id = 'dnr.' + generateId();
  newMqttIn.x = node.x - 20;
  newMqttIn.y = node.y - 20;
  newMqttIn.z = node.z;
  newMqttIn.topic = nodeInput.id + '-' + nodeInputOutput + '-' + node.id;

  newMqttIn.wires[0].push(node.id);

  return newMqttIn;
}

function dnrizeConfig(_config){
  var config = clone(_config);

  var newMqtts = [];
  var dnrnodes = {};
  var reverseWires = extractReverseWires(config);
  var forwardWires = extractForwardWires(config);

  for (var j = 0; j < config.length; j++){
    var node = config[j];
    if (node.constraints && !satisfyConstraints(node.constraints) && Object.keys(node.constraints).length != 0){
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

          var newMqttIn = makeMqttIn(node, k, nodeInputs[i]);
          newMqtts.push(newMqttIn);
          
        }
      }
    }

    for (var i = 0; i < nodeOutputs.length; i++){
      var outputI = nodeOutputs[i];


      for (var k = 0; k < outputI.length; k++){
        if (dnrnodes[outputI[k]])
          continue;

        var newMqttOut = makeMqttOut(node, i, outputI[k]);
        newMqtts.push(newMqttOut);
      }
    }
  }

  config.push(DnrComm().getBroker());

  for (var i = 0; i < newMqtts.length; i++)
    config.push(newMqtts[i]);

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

function redeployConfig(dnrizedConfig){
  // TODO: discover this endpoint or get from settings
  var nrEndpoint = 'http://localhost:1880/flows';
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

  if (payload)
    req.write(payload);

  req.end();
}

function satisfyConstraints(constraints){
	// TODO: implement this logic!
  for (var c in constraints){
    if (!constraints.hasOwnProperty(c))
      continue;

  	if (constraints[c].deviceId && constraints[c].deviceId === settings.deviceId)
  			return true;
  }
	return false;
}

module.exports = {
  dnrizeConfig: dnrizeConfig,
  redeployConfig: redeployConfig,
  DnrComm: DnrComm,
  extractReverseWires: extractReverseWires,
  extractForwardWires: extractForwardWires,
  makeMqttIn: makeMqttIn,
  makeMqttOut: makeMqttOut
}
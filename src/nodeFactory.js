var utils = require('./utils');
var generateId = utils.generateId;

function Dnr(){

}

function DnrComm(){
  return {
    getBroker: function(){
      return this.broker;
    },
    getDnr: function(){
      return this.dnr;
    },
    getDnrIn: function(){
      return this.mqttIn;
    },
    getDnrOut: function(){
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
    dnr: {
      "broker": "dnr.system_node",
      "id": "",
      "name": "",
      "topic": "",
      "type": "dnr",
      "wires": [[]],
      "x": 0,
      "y": 0,
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

function makeDnrOut(node, nodeOutput, nodeOutputWire){
  var newDnrOut = DnrComm().getDnr();
  newDnrOut.id = 'dnr.' + generateId();
  newDnrOut.x = node.x + 20;
  newDnrOut.y = node.y + 20;
  newDnrOut.z = node.z;
  newDnrOut.topic = node.id + '-' + nodeOutput + '-' + nodeOutputWire;

  node.wires[nodeOutput].push(newDnrOut.id);

  return newDnrOut;
}

function makeDnrIn(node, nodeInputOutput, nodeInput){
  var newDnrIn = DnrComm().getDnr();;
  newDnrIn.id = 'dnr.' + generateId();
  newDnrIn.x = node.x - 20;
  newDnrIn.y = node.y - 20;
  newDnrIn.z = node.z;
  newDnrIn.topic = nodeInput.id + '-' + nodeInputOutput + '-' + node.id;

  newDnrIn.wires[0].push(node.id);

  return newDnrIn;
}

module.exports = {
  DnrComm: DnrComm,
  makeDnrIn: makeDnrIn,
  makeDnrOut: makeDnrOut
}

var should = require("should");
var clone = require("clone");

var flows = require('../flows');
var utils = require('./test_util');
var testData = require('./dnr_test_data');

describe("dnr flows tests", function() {
  
  var testDeleteFlow = function(currentFlows, deletingFlow, expectedFlows){
    flows.setActiveFlows(currentFlows);
    flows.deleteFlow(deletingFlow);
    
    var newFlows = flows.getActiveFlowsAsArray();
    utils.compareFlows(newFlows, expectedFlows); 
  };
  
  var testAddFlow = function(currentFlows, addingFlow, expectedFlows){
    flows.setActiveFlows(currentFlows);
    flows.addFlow(addingFlow);
    
    var newFlows = flows.getActiveFlowsAsArray();
    utils.compareFlows(newFlows, expectedFlows); 
  }
  
  describe('adding flow test', function(){
    it('add a new flow into local Node-RED process', function(){
      testAddFlow(testData.test10, testData.flow0, testData.test10AddedFlow0);
      testAddFlow(testData.test10, testData.flow1, testData.test10AddedFlow0);
      testAddFlow(testData.test10, testData.flow3, testData.test10AddedFlow0);
      
      // TODO: expect error throw test?
      testAddFlow(testData.test10, testData.flow2, testData.test10AddedFlow2);
    })
  });
  
  describe('deleting flow test', function(){
    it('delete an existing flow of local Node-RED process', function(){
      testDeleteFlow(testData.test14, "9f44707d.1f1d1", testData.test11);
      testDeleteFlow(testData.test14, "bc524b0b.dc4098", testData.test12);
      testDeleteFlow(testData.test14, "bfa1693.78d5898", testData.test13);
    })
  });
});
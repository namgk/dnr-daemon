/**
 * Copyright 2014 IBM Corp.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

var should = require("should");
var clone = require("clone");

var flows = require('../flows');
var testData = require('./dnr_test_data');

describe("dnr flows tests", function() {
  // before(function() {
  //   dnr.init({deviceId: '1880'});
  // });
  
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
  
  var testDeleteFlow = function(currentFlows, deletingFlow, expectedFlows){
    flows.setActiveFlows(currentFlows);
    flows.deleteFlow(deletingFlow);
    
    var newFlows = flows.getActiveFlowsAsArray();
    compareFlows(newFlows, expectedFlows); 
  };
  
  var testAddFlow = function(currentFlows, addingFlow, expectedFlows){
    flows.setActiveFlows(currentFlows);
    flows.addFlow(addingFlow);
    
    var newFlows = flows.getActiveFlowsAsArray();
    compareFlows(newFlows, expectedFlows); 
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
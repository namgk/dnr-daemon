var clone = require("clone");

function generateId(existingIdsArray) {
  var newId = (1+Math.random()*4294967295).toString(16);
  for (var i = 0; i < existingIdsArray.length; i++){
    if (existingIdsArray[i] === newId){
      return generateId(existingIdsArray);
    }
  }
  
  return newId;
}

function Flows(){
  var activeFlows = {};
  
  this.getActiveFlows = function (){
    return activeFlows;
  };
  
  this.getActiveFlowsAsArray = function(){
    var flowsId = Object.keys(activeFlows);
    var activeFlowsArray = [];
    
    for (var i = 0; i < flowsId.length; i++){
      activeFlowsArray.push(activeFlows[flowsId[i]]);
    }
    
    return activeFlowsArray;
  }
  
  this.setActiveFlows = function (flows){
    activeFlows = {};
    
    if (!Array.isArray(flows)){
      activeFlows = flows;
      return;
    }
    
    for (var i = 0; i < flows.length; i++){
      var flowId = flows[i].id;
      if (activeFlows[flowId]){
        console.log('activeFlows: duplicated id found in input flows');
        return;
      }
      activeFlows[flows[i].id] = flows[i];
    }
  };
}

Flows.prototype.addFlow = function(flow){
  if (!Array.isArray(flow))
    return;
    
  var activeFlows = this.getActiveFlows();
    
  var originalActiveFlows = clone(activeFlows);
  
  // TODO: is this flow already existed in the activeFlows?
  // this flow doesn't have any id, just an array of nodes exported from the UI
  // SO, may be dnr-editor should also export the flow id?
  
  // 1. find all the subflows and add normal nodes
  var subflows = [];
  var subflowsExt = [];
  var flowTab = [];
  var nodesIdChangeMap = {}; // old -> new
  
  for (var i = 0; i < flow.length; i++){
    if (flow[i].id && flow[i].type === 'tab' && activeFlows[flow[i].id] && activeFlows[flow[i].id].type === 'tab'){
      console.log('activeFlows: flow seems already existed, reverting!');
      this.setActiveFlows(originalActiveFlows);
      return;
    } 
    
    if (activeFlows[flow[i].id]){
      // rename node id!
      nodesIdChangeMap[flow[i].id] = generateId(Object.keys(activeFlows));
      flow[i].id = nodesIdChangeMap[flow[i].id];
    } 
  }
  
  // updating z if node id has changed
  for (var i = 0; i < flow.length; i++){
    if (flow[i].z && nodesIdChangeMap[flow[i].z]){
      flow[i].z = nodesIdChangeMap[flow[i].z];
    }
  }
  
  // updating wires if node id has changed
  for (var i = 0; i < flow.length; i++){
    var nodeWires = flow[i].wires;
    if (!nodeWires){
      continue;
    }
    
    for (var j = 0; j < nodeWires.length; j++){
      for (var k = 0; k < nodeWires[j].length; k++){
        if (nodeWires[j][k] && nodesIdChangeMap[nodeWires[j][k]]){
          nodeWires[j][k] = nodesIdChangeMap[nodeWires[j][k]];
        }
      }
    }
  }
  
  for (var i = 0; i < flow.length; i++){
    if (!flow[i].id){
      console.log('activeFlows: invalid flow node detected! \n' + flow[i]);
      continue;
    }
    
    if (flow[i].type === 'subflow'){
      subflows.push(flow[i]);
    } else if (flow[i].type.indexOf('subflow:') === 0){
      subflowsExt.push(flow[i]);
    } else if (flow[i].type === 'tab'){
      flowTab.push(flow[i]);
    } else {
      activeFlows[flow[i].id] = flow[i];
    }
  }
  
  // FIXME: weak comparison
  if (subflows.length !== subflowsExt.length){
    console.log('activeFlows: Flow not added due to subflow information not correct, reverting');
    this.setActiveFlows(originalActiveFlows);
    return;
  }
  
  if (flowTab.length > 1){
    console.log('activeFlows: should have only one flow tab, reverting');
    this.setActiveFlows(originalActiveFlows);
    return;
  }
  
  // 2. Create new tab
  var newFlow;
  if (flowTab.length == 0){
    newFlow = {
      id: generateId(Object.keys(activeFlows)),
      type: 'tab',
      label: generateId(Object.keys(activeFlows))
    };
  } else {
    newFlow = flowTab[0];
  }
  activeFlows[newFlow.id] = newFlow;
  
  // 3. adding subflows
  for (var i = 0; i < subflows.length; i++){
    if (activeFlows[subflows[i].id]){
      subflows[i].id = generateId(Object.keys(activeFlows));
    }
    activeFlows[subflows[i].id] = subflows[i];
    
    // update nodes inside subflows if their id have changed
    var ins = subflows[i].in;
    var outs = subflows[i].out;
    
    for (var j = 0; j < ins.length; j++){
      var inWires = ins[j].wires;
      for (var k = 0; k < inWires.length; k++){
        if (nodesIdChangeMap[inWires[k].id]){
          inWires[k].id = nodesIdChangeMap[inWires[k].id];
        }
      }
    }
    
    for (var j = 0; j < outs.length; j++){
      var outWires = outs[j].wires;
      for (var k = 0; k < outWires.length; k++){
        if (nodesIdChangeMap[outWires[k].id]){
          outWires[k].id = nodesIdChangeMap[outWires[k].id];
        }
      }
    }
  }
  
  for (var i = 0; i < subflowsExt.length; i++){
    if (activeFlows[subflowsExt[i].id]){
      subflowsExt[i].id = generateId(Object.keys(activeFlows));
    }
    activeFlows[subflowsExt[i].id] = subflowsExt[i];
  }
};

Flows.prototype.updateFlow = function (flowId, flow){
  var activeFlows = this.getActiveFlows();
  
  if (!Array.isArray(flow) || !activeFlows[flowId]){
    return;
  }
    
  this.deleteFlow(flowId);
  this.addFlow(flow);
};

Flows.prototype.deleteFlow = function (flowId){
  var activeFlows = this.getActiveFlows();
  
  if (!activeFlows[flowId] || activeFlows[flowId].type !== 'tab'){
    return;
  }
  
  delete activeFlows[flowId];
  
  for (var key in activeFlows) {
    if (!activeFlows.hasOwnProperty(key)){
      continue;
    }
    
    if (activeFlows[key].z && activeFlows[key].z === flowId){
      delete activeFlows[key];
    }
  }

};


module.exports = new Flows();
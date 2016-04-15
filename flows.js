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
  this.activeFlows = {};
  
  this.addFlow = function (flow){
    if (!flow[0])
      return;
    
    // TODO: is this flow already existed in the activeFlows?
    // this flow doesn't have any id, just an array of nodes exported from the UI
    
    // FIXME: for now, just add :(
    
    // 1. find all the subflows and add normal nodes
    var subflows = [];
    var subflowsExt = [];
    var flowTab = [];
    var nodesIdChangeMap = {}; // old -> new
    
    for (var i = 0; i < flow.length; i++){
      if (!flow[i].id){
        console.log('WARNING: invalid flow node detected! \n' + flow[i]);
        continue;
      }
      
      if (flow[i].type === 'subflow'){
        subflows.push(flow[i]);
      } else if (flow[i].type.indexOf('subflow:') === 0){
        subflowsExt.push(flow[i]);
      } else if (flow[i].type === 'tab'){
        flowTab.push(flow[i]);
      } else {
        if (this.activeFlows[flow[i].id]){
          nodesIdChangeMap[flow[i].id] = generateId(Object.keys(this.activeFlows));
          flow[i].id = nodesIdChangeMap[flow[i].id];
        } else {
          this.activeFlows[flow[i].id] = flow[i];
        }
      }
    }
    
    // FIXME: weak comparison
    if (subflows.length !== subflowsExt.length){
      console.log('WARNING: Flow not added due to subflow information not correct');
      return;
    }
    
    if (flowTab.length > 1){
      console.log('WARNING: should have only one flow tab');
      return;
    }
    
    // 2. Create new flow
    var newFlow;
    if (flowTab.length == 0){
      newFlow = {
        id: generateId(Object.keys(this.activeFlows)),
        type: 'tab',
        label: generateId(Object.keys(this.activeFlows))
      }
    } else {
      newFlow = flowTab[0];
    }
    
    if (this.activeFlows[newFlow.id])
      newFlow.id = generateId(Object.keys(this.activeFlows));
      
    this.activeFlows[newFlow.id] = newFlow;
    
    for (var i = 0; i < subflows.length; i++){
      if (this.activeFlows[subflows[i].id]){
        subflows[i].id = generateId(Object.keys(this.activeFlows));
      }
      this.activeFlows[subflows[i].id] = subflows[i];
      
      // process with nodes inside subflows
      
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
      if (this.activeFlows[subflowsExt[i].id]){
        subflowsExt[i].id = generateId(Object.keys(this.activeFlows));
      }
      this.activeFlows[subflowsExt[i].id] = subflowsExt[i];
    }
    
  };
  
  this.updateFlow = function (flowId, flow){

  };
  
  this.deleteFlow = function (flowId){

  };
  
  this.getActiveFlows = function (){
    return this.activeFlows;
  };
  
  this.getActiveFlowsAsArray = function(){
    var flowsId = Object.keys(this.activeFlows);
    var activeFlowsArray = [];
    
    for (var i = 0; i < flowsId.length; i++){
      activeFlowsArray.push(this.activeFlows[flowsId[i]]);
    }
    
    return activeFlowsArray;
  }
  
  this.setActiveFlows = function (flows){
    this.activeFlows = {};
    
    if (!Array.isArray(flows)){
      this.activeFlows = flows;
      return;
    }
    
    for (var i = 0; i < flows.length; i++){
      var flowId = flows[i].id;
      if (this.activeFlows[flowId]){
        console.log('WARNING: duplicated id found in input flows');
        return;
      }
      this.activeFlows[flows[i].id] = flows[i];
    }
    
    // console.log(this.activeFlows);
  };
  
}

module.exports = new Flows();
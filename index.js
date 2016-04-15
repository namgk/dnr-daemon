var activeFlows = {};

function onFlowAdded(flow){
  var flowId = flow.id;
  if (activeFlows[flowId])
    return;
    
}

function onFlowUpdated(flowId, flow){
  if (!activeFlows[flowId])
    return;
    
}

function onFlowDeleted(flowId){
  if (!activeFlows[flowId])
    return;
    
}

function getActiveFlows(){
  return activeFlows;
}

module.exports = {
  addFlow : onFlowAdded,
  updateFlow : onFlowUpdated,
  deleteFlow : onFlowDeleted
}
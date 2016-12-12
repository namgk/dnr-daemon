import Auth from './auth';
import FlowsAPI from './flows';
import Dnr from './dnr'
import Utils from './utils'
import Settings from './settings';

// let = block

var auth = new Auth(Settings.TARGET, Settings.USER, Settings.PASS);
var upstreamAuth = new Auth(Settings.UPSTREAM, Settings.UPSTREAM_USER, Settings.UPSTREAM_PASS);

var flowsApi: FlowsAPI = new FlowsAPI(auth)
var upstreamFlowsApi: FlowsAPI = new FlowsAPI(upstreamAuth)

var command = process.argv[2]

if (command === 'getflow'){
  var flowId = process.argv[3]
  if (!flowId){
    console.log('usage: npm start getflow <flowId>')
    process.exit()
  }

  upstreamFlowsApi.getFlow(flowId).then(r=>{
    console.log(r)
  }).catch(e=>{
    console.log(e)
  })
} else if (command === 'deploy'){
  var flowId = process.argv[3]
  if (!flowId){
    console.log('usage: npm start deploy <flowId>')
    process.exit()
  }

  upstreamFlowsApi.getFlow(flowId).then(r=>{
    return JSON.parse(r)
  }).then(function(flow){
    var renamed : any = {}
    for (let node of flow.nodes){
      renamed[node.id] = Utils.generateId()
      node.id = renamed[node.id]
    }
    for (let node of flow.nodes){
      for (let i = 0; i < node.wires.length; i++){
        let wires = node.wires[i]
        for (let j = 0; j < wires.length; j++){
          let w = wires[j]
          wires[j] = renamed[w]
        }
        node.wires[i] = wires
      }
    }
    var dnrizedFlow = Dnr.dnrize(flow)
    return flowsApi.installFlow(JSON.stringify(dnrizedFlow))
  }).then(rr=>{
    console.log(rr)
  }).catch(e=>{
    console.log(e)
  })
} else {
  console.log('usage: npm start <getflow|deploy> <flowId>')
  process.exit()
}


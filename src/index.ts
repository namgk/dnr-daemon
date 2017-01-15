import Auth from './auth';
import FlowsAPI from './flows';
import Dnr from './dnr'
import Utils from './utils'
import Settings from './settings';

var upstreamAuth = new Auth(Settings.UPSTREAM, Settings.UPSTREAM_USER, Settings.UPSTREAM_PASS);
var auth = new Auth(Settings.TARGET, Settings.USER, Settings.PASS);

var upstreamAuthed = false
upstreamAuth.auth().then(()=>{
  upstreamAuthed = true
  main()
})

function main(){
  var upstreamFlowsApi: FlowsAPI = new FlowsAPI(upstreamAuth)
  var flowsApi: FlowsAPI = new FlowsAPI(auth)

  // demo
  var auth1 = new Auth(Settings.TARGET1, Settings.USER, Settings.PASS);
  var auth2 = new Auth(Settings.TARGET2, Settings.USER, Settings.PASS);
  var auth3 = new Auth(Settings.TARGET3, Settings.USER, Settings.PASS);
  var auth4 = new Auth(Settings.TARGET4, Settings.USER, Settings.PASS);
  var auth5 = new Auth(Settings.TARGET5, Settings.USER, Settings.PASS);
  var flowsApi1: FlowsAPI = new FlowsAPI(auth1)
  var flowsApi2: FlowsAPI = new FlowsAPI(auth2)
  var flowsApi3: FlowsAPI = new FlowsAPI(auth3)
  var flowsApi4: FlowsAPI = new FlowsAPI(auth4)
  var flowsApi5: FlowsAPI = new FlowsAPI(auth5)

  var command = process.argv[2]
  if (command === 'getallflow'){
    upstreamFlowsApi.getAllFlow().then(r=>{
      console.log(r)
    }).catch(e=>{
      console.log(e)
    })
  } else if (command === 'getflow'){
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
      return flowsApi5.installFlow(JSON.stringify(dnrizedFlow))
    }).then(rr=>{
      console.log(rr)
    }).catch(e=>{
      console.log(e)
    })
  } else if (command === 'deployAll'){
    var flowId = process.argv[3]
    if (!flowId){
      console.log('usage: npm start deployAll <flowId>')
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
      return Dnr.dnrize(flow)
    }).then(dnrizedFlow=>{
      flowsApi1.installFlow(JSON.stringify(dnrizedFlow))
      return dnrizedFlow
    }).then(dnrizedFlow=>{
      flowsApi2.installFlow(JSON.stringify(dnrizedFlow))
      return dnrizedFlow
    }).then(dnrizedFlow=>{
      flowsApi3.installFlow(JSON.stringify(dnrizedFlow))
      return dnrizedFlow
    }).then(dnrizedFlow=>{
      return flowsApi4.installFlow(JSON.stringify(dnrizedFlow))
    }).catch(e=>{
      console.log(e)
    })
  } else {
    console.log('usage: npm start <getflow|deploy|deployAll> <flowId>')
    process.exit()
  }

}
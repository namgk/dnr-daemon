import Auth from './auth';
import FlowsAPI from './flows';
import Dnr from './dnr'
import Utils from './utils'
import Settings from './settings';

// let = block

let auth = new Auth(Settings.TARGET, Settings.USER, Settings.PASS);
var flowsApi: FlowsAPI = null
auth.probeAuth().then(r=>{
  flowsApi = new FlowsAPI(auth)
  main()
}).catch(e=>{
  auth.auth().then(r=>{
    flowsApi = new FlowsAPI(auth)
    main()
  }).catch(e=>{
    throw "cannot authenticate!! " + e;
  })
})

function main(){
  flowsApi.getFlow('1c925984.e34566').then(r=>{
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
}

import Auth from '../src/auth';
import FlowsAPI from '../src/flows';
import fs = require('fs');
import {expect} from 'chai';

describe("Test Flows", function () {
  let auth: Auth = null
  let flowsApi: FlowsAPI = null
  var testData = fs.readFileSync(__dirname + '/../../test/test_data.json', 'utf8')
  var testDataObj = JSON.parse(testData)
  var testConfig = fs.readFileSync(__dirname + '/../../test/test_configs.json', 'utf8')
  var testConfigObj = JSON.parse(testConfig)
  
  before(function (done) {
    let target = testConfigObj.auth_targets[0].TARGET
    let user = testConfigObj.auth_targets[0].USER
    let auth = new Auth(target, user, process.env.NRPWD);
    auth.probeAuth().then(r=>{
      flowsApi = new FlowsAPI(auth)
      done()
    }).catch(function(e){
      auth.auth().then(r=>{
        flowsApi = new FlowsAPI(auth)
        done()
      }).catch(done)
    })
  })

  it('install, delete flow', function(done){
    var test_flow = testDataObj.inject_debug
    flowsApi.installFlow(JSON.stringify(test_flow))
    .then(r=>{
      let flow = JSON.parse(r)
      expect(flow.id).to.not.undefined
      flowsApi.uninstallFlow(flow.id).then(r=>{
        done()
      }).catch(done)
    }).catch(done)
  })

  it.only('multiple installs', function(done){
    var INSTALLS : any[] = [] 

    var test_flow = testDataObj.inject_debug
    var inject_only = testDataObj.inject_only

    // uncomment these to enable the test
    INSTALLS.push(test_flow)
    INSTALLS.push(inject_only)

    let installRequests = []
    for (let i = 0; i < INSTALLS.length; i++){
      installRequests.push(
        flowsApi.installFlow(JSON.stringify(test_flow))
        .then(r=>{
          let flow = JSON.parse(r)
          return flow.id
        })
      )
    }

    Promise.all(installRequests)
    .then(rs=>{
      expect(rs.length).to.equal(INSTALLS.length)
      
      let getRequests = []
      for (let r of rs){
        getRequests.push(flowsApi.getFlow(r))
      }

      return Promise.all(getRequests)
    })
    .then(rss=>{
      expect(rss.length).to.equal(INSTALLS.length)
      done()
    })
    .catch(done)
  })

  it("install, get and delete flow", function (done) {
    var test_flow = testDataObj.inject_func_debug

    flowsApi.installFlow(JSON.stringify(test_flow))
    .then(f=>{
      let flow = JSON.parse(f)
      expect(flow.id).to.not.undefined
      return flow.id
    })
    .then(fid=>{
      return flowsApi.getFlow(fid) // this is a promise
    })
    .then(f=>{
      let flow = JSON.parse(f)
      expect(flow.id).to.not.undefined
      expect(flow.nodes).to.not.undefined
      return flowsApi.uninstallFlow(flow.id)
    })
    .then(done)
    .catch(done)
  });
})
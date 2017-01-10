import Auth from '../src/auth';
import FlowsAPI from '../src/flows';
import Settings from './settings';

import fs = require('fs');

import {expect} from 'chai';

describe("Test Flows", function () {
  let auth: Auth = null
  let flowsApi: FlowsAPI = null
  var testData = fs.readFileSync(__dirname + '/../../test/test_data.json', 'utf8')
  var testDataObj = JSON.parse(testData)

  before(function (done) {
    let auth = new Auth(Settings.TARGET, Settings.USER, Settings.PASS);
    auth.probeAuth().then(r=>{
      flowsApi = new FlowsAPI(auth)
      done()
    }).catch(function(e){
      auth.auth().then(r=>{
        flowsApi = new FlowsAPI(auth)
        done()
      }).catch(e=>{
        done('auth not success')
      })
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
      }).catch(e=>{
        done('error deleting flow ' + e)
      })
    }).catch(e=>{
      done('error installing flow '+ e)
    })
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
    .then(deleteResult=>{
      done()
    })
    .catch(e=>{
      done('error in flow API '+ e)
    })
  });
})
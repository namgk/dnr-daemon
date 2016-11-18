import Auth from '../src/auth';
import FlowsAPI from '../src/flows';

import fs = require('fs');

import {expect} from 'chai';

describe("Test Flows", function () {
  let auth: Auth = null
  let flowsApi: FlowsAPI = null

  before(function (done) {
    auth = new Auth('http://seawolf1.westgrid.ca:1880', 'admin', process.env.NRPWD);
    auth.probeAuth().then((r)=>{
      flowsApi = new FlowsAPI(auth)
      done()
    }).catch(e=>{
      done('error!')
    })
  })


  it("install, get and delete flow", function (done) {
    var testData = fs.readFileSync(__dirname + '/../../test/./flows_data.json', 'utf8')
    var inject_debug = JSON.parse(testData).inject_debug
    flowsApi.installFlow(JSON.stringify(inject_debug))
    .then(r=>{
      return JSON.parse(r).id
    })
    .then(fid=>{
      return flowsApi.getFlow(fid)
    })
    .then(flow=>{
      var flowId = JSON.parse(flow).id
      return flowsApi.uninstallFlow(flowId)
    })
    .then(deleteResult=>{
      done()
    })
    .catch((e)=>{
      done('error getting flow'+ e)
    })
  });
})
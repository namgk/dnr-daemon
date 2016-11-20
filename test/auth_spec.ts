import Auth from '../src/auth';
import fs = require('fs');

import {expect} from 'chai';

describe("Test Auth", function () {
  var targets : any[] = [
    {
      TARGET: 'http://seawolf1.westgrid.ca:1818',
      USER: 'admin',
      PASS: process.env.NRPWD
    },
    {
      TARGET: 'http://seawolf1.westgrid.ca:1880',
      USER: 'admin',
      PASS: process.env.NRPWD
    }
  ]

  before(function () {
    if (!fs.existsSync(process.env.HOME+ '/.dnr-daemon')){
      fs.mkdirSync(process.env.HOME+ '/.dnr-daemon');
    }
  })

  for (let target of targets){
    it("authenticates", function (done) {
      let auth = new Auth(target.TARGET, target.USER, target.PASS);
      auth.probeAuth().then(r=>{
        console.log('login successfully, token: ' + auth.getToken())
        done()
      }).catch(function(e){
        auth.auth().then(r=>{
          console.log('login successfully, token: ' + auth.getToken())
          done()
        }).catch(e=>{
          console.log('error: ' + e)
          done('error')
        })
      })
    });
  }
})
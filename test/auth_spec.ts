import Auth from '../src/auth';
import fs = require('fs');

import {expect} from 'chai';

describe("Test Auth", function () {
  before(function () {
    if (!fs.existsSync(process.env.HOME+ '/.dnr-daemon')){
      fs.mkdirSync(process.env.HOME+ '/.dnr-daemon');
    }
  })

  it.only("authenticates", function (done) {
    let auth = new Auth('http://seawolf1.westgrid.ca:1880', 'admin', process.env.NRPWD);
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
})
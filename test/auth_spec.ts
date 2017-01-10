import Auth from '../src/auth';
import fs = require('fs');
import Settings from './settings';

import {expect} from 'chai';

describe("Test Auth", function () {
  var targets : any[] = [
    {
      TARGET: 'http://localhost:1443',
      USER: 'admin',
      PASS: process.env.NRPWD
    },
    {
      TARGET: 'http://localhost:2443',
      USER: 'admin',
      PASS: process.env.NRPWD
    }
  ]

  var targetNoAuth : string = 'http://localhost:1880'

  // TODO: clear .dnr-daemon before all tests
  before(function () {
    if (!fs.existsSync(process.env.HOME+ '/.dnr-daemon')){
      fs.mkdirSync(process.env.HOME+ '/.dnr-daemon');
    }
  })

  for (let target of targets){
    it("authenticates", function (done) {
      let auth = new Auth(target.TARGET, target.USER, target.PASS);
      auth.probeAuth().then(r=>{
        expect(auth.getToken()).to.not.undefined
        expect(auth.getToken()).to.not.equal('noauth')
        done()
      }).catch(function(e){
        auth.auth().then(r=>{
          expect(auth.getToken()).to.not.undefined
          expect(auth.getToken()).to.not.equal('noauth')
          done()
        }).catch(e=>{
          console.log('error: ' + e)
          done('error')
        })
      })
    });
  }

  for (let target of targets){
    it("not authenticates - empty username/password", function (done) {
      let auth = new Auth(target.TARGET, '', '');
      auth.probeAuth().then(r=>{
        done('should not be here')
      }).catch(function(e){
        auth.auth().then(r=>{
          done('should not be here')
        }).catch(e=>{
          console.log('error: ' + e)
          done()
        })
      })
    });
  }

  for (let target of targets){
    it("not authenticates - wrong username/password", function (done) {
      let auth = new Auth(target.TARGET, 'awef', 'fwe');
      auth.probeAuth().then(r=>{
        done('should not be here')
      }).catch(function(e){
        auth.auth().then(r=>{
          done('should not be here')
        }).catch(e=>{
          console.log('error: ' + e)
          done()
        })
      })
    });
  }

  it("works with no auth", function (done) {
    let auth = new Auth(targetNoAuth, '', '');
    auth.probeAuth().then(r=>{
      expect(auth.getToken()).to.equal('noauth')
      done()
    }).catch(function(e){
      console.log('error: ' + e)
      done('error')
    })
  });
})
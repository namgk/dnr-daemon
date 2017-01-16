import Auth from '../src/auth';
import fs = require('fs');
import Settings from './settings';
import request = require('request-promise-native');
import {expect} from 'chai';

describe("Test Auth", function () {
  var testData = fs.readFileSync(__dirname + '/../../test/test_configs.json', 'utf8')
  var testDataObj = JSON.parse(testData)
  var targets = testDataObj.auth_targets
  var targetNoAuth = testDataObj.noauth_targets

  before(function (done) {
    if (!fs.existsSync(process.env.HOME+ '/.dnr-daemon')){
      fs.mkdirSync(process.env.HOME+ '/.dnr-daemon');
    }

    let requestProms = []

    for (let target of targets){
      const optNoAuth: request.OptionsWithUri = {
        baseUrl: target.TARGET,
        uri: '/'
      };

      requestProms.push(request(optNoAuth))
    }

    Promise.all(requestProms).then(function () {
      done()
    }).catch(function(e){
      done(1)
    })
  })

  beforeEach(function() {
    var tokens = fs.readdirSync(process.env.HOME+ '/.dnr-daemon')
    for (let token of tokens){
      fs.unlinkSync(process.env.HOME+ '/.dnr-daemon/' + token)
    }
  })

  for (let target of targets){
    it("authenticates", function (done) {
      let auth = new Auth(target.TARGET, target.USER, process.env.NRPWD);
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
    it("not authenticates with empty username/password", function (done) {
      let auth = new Auth(target.TARGET, '', '');
      auth.probeAuth().then(r=>{
        done('should not be here')
      }).catch(function(e){
        auth.auth().then(r=>{
          done('should not be here')
        }).catch(e=>{
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
          done()
        })
      })
    });
  }

  for (let target of targetNoAuth){
    it("works with no auth", function (done) {
      let auth = new Auth(target, '', '');
      auth.probeAuth().then(r=>{
        expect(auth.getToken()).to.equal('noauth')
        done()
      }).catch(function(e){
        done('should not be here')
      })
    });
  }

})
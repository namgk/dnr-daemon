import Auth from '../src/auth';

import {expect} from 'chai';

describe("Test Auth", function () {
  beforeEach(function () {});

  afterEach(function () {});

  it("authenticates", function (done) {
    let auth = new Auth('http://seawolf1.westgrid.ca:1880', 'admin', 'test');
    auth.auth().then((r)=>{
      console.log('e1')
      done()
    }).catch(function(e){
      console.log('e')
      done(false)
    })
  });
})
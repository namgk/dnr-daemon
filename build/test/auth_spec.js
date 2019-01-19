"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("../src/auth");
const fs = require("fs");
const request = require("request-promise-native");
const chai_1 = require("chai");
describe("Test Auth", function () {
    var testData = fs.readFileSync(__dirname + '/../../test/test_configs.json', 'utf8');
    var testDataObj = JSON.parse(testData);
    var targets = testDataObj.auth_targets;
    var targetNoAuth = testDataObj.noauth_targets;
    before(function (done) {
        if (!fs.existsSync(process.env.HOME + '/.dnr-daemon')) {
            fs.mkdirSync(process.env.HOME + '/.dnr-daemon');
        }
        let requestProms = [];
        for (let target of targets) {
            const optNoAuth = {
                baseUrl: target.TARGET,
                uri: '/'
            };
            requestProms.push(request(optNoAuth));
        }
        Promise.all(requestProms).then(function () {
            done();
        }).catch(function (e) {
            done(1);
        });
    });
    beforeEach(function () {
        var tokens = fs.readdirSync(process.env.HOME + '/.dnr-daemon');
        for (let token of tokens) {
            fs.unlinkSync(process.env.HOME + '/.dnr-daemon/' + token);
        }
    });
    for (let target of targets) {
        it("authenticates", function (done) {
            let auth = new auth_1.default(target.TARGET, target.USER, process.env.NRPWD);
            auth.probeAuth().then(r => {
                chai_1.expect(auth.getToken()).to.not.undefined;
                chai_1.expect(auth.getToken()).to.not.equal('noauth');
                done();
            }).catch(function (e) {
                auth.auth().then(r => {
                    chai_1.expect(auth.getToken()).to.not.undefined;
                    chai_1.expect(auth.getToken()).to.not.equal('noauth');
                    done();
                }).catch(e => {
                    console.log('error: ' + e);
                    done('error');
                });
            });
        });
    }
    for (let target of targets) {
        it("not authenticates with empty username/password", function (done) {
            let auth = new auth_1.default(target.TARGET, '', '');
            auth.probeAuth().then(r => {
                done('should not be here');
            }).catch(function (e) {
                auth.auth().then(r => {
                    done('should not be here');
                }).catch(e => {
                    done();
                });
            });
        });
    }
    for (let target of targets) {
        it("not authenticates - wrong username/password", function (done) {
            let auth = new auth_1.default(target.TARGET, 'awef', 'fwe');
            auth.probeAuth().then(r => {
                done('should not be here');
            }).catch(function (e) {
                auth.auth().then(r => {
                    done('should not be here');
                }).catch(e => {
                    done();
                });
            });
        });
    }
    for (let target of targetNoAuth) {
        it("works with no auth", function (done) {
            let auth = new auth_1.default(target, '', '');
            auth.probeAuth().then(r => {
                chai_1.expect(auth.getToken()).to.equal('noauth');
                done();
            }).catch(function (e) {
                done('should not be here');
            });
        });
    }
});
//# sourceMappingURL=auth_spec.js.map
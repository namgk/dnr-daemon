"use strict";
var auth_1 = require('../src/auth');
var fs = require('fs');
var request = require('request-promise-native');
var chai_1 = require('chai');
describe("Test Auth", function () {
    var testData = fs.readFileSync(__dirname + '/../../test/test_configs.json', 'utf8');
    var testDataObj = JSON.parse(testData);
    var targets = testDataObj.auth_targets;
    var targetNoAuth = testDataObj.noauth_targets;
    before(function (done) {
        if (!fs.existsSync(process.env.HOME + '/.dnr-daemon')) {
            fs.mkdirSync(process.env.HOME + '/.dnr-daemon');
        }
        var requestProms = [];
        for (var _i = 0, targets_1 = targets; _i < targets_1.length; _i++) {
            var target = targets_1[_i];
            var optNoAuth = {
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
        for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
            var token = tokens_1[_i];
            fs.unlinkSync(process.env.HOME + '/.dnr-daemon/' + token);
        }
    });
    var _loop_1 = function(target) {
        it("authenticates", function (done) {
            var auth = new auth_1.default(target.TARGET, target.USER, process.env.NRPWD);
            auth.probeAuth().then(function (r) {
                chai_1.expect(auth.getToken()).to.not.undefined;
                chai_1.expect(auth.getToken()).to.not.equal('noauth');
                done();
            }).catch(function (e) {
                auth.auth().then(function (r) {
                    chai_1.expect(auth.getToken()).to.not.undefined;
                    chai_1.expect(auth.getToken()).to.not.equal('noauth');
                    done();
                }).catch(function (e) {
                    console.log('error: ' + e);
                    done('error');
                });
            });
        });
    };
    for (var _i = 0, targets_2 = targets; _i < targets_2.length; _i++) {
        var target = targets_2[_i];
        _loop_1(target);
    }
    var _loop_2 = function(target) {
        it("not authenticates with empty username/password", function (done) {
            var auth = new auth_1.default(target.TARGET, '', '');
            auth.probeAuth().then(function (r) {
                done('should not be here');
            }).catch(function (e) {
                auth.auth().then(function (r) {
                    done('should not be here');
                }).catch(function (e) {
                    done();
                });
            });
        });
    };
    for (var _a = 0, targets_3 = targets; _a < targets_3.length; _a++) {
        var target = targets_3[_a];
        _loop_2(target);
    }
    var _loop_3 = function(target) {
        it("not authenticates - wrong username/password", function (done) {
            var auth = new auth_1.default(target.TARGET, 'awef', 'fwe');
            auth.probeAuth().then(function (r) {
                done('should not be here');
            }).catch(function (e) {
                auth.auth().then(function (r) {
                    done('should not be here');
                }).catch(function (e) {
                    done();
                });
            });
        });
    };
    for (var _b = 0, targets_4 = targets; _b < targets_4.length; _b++) {
        var target = targets_4[_b];
        _loop_3(target);
    }
    var _loop_4 = function(target) {
        it("works with no auth", function (done) {
            var auth = new auth_1.default(target, '', '');
            auth.probeAuth().then(function (r) {
                chai_1.expect(auth.getToken()).to.equal('noauth');
                done();
            }).catch(function (e) {
                done('should not be here');
            });
        });
    };
    for (var _c = 0, targetNoAuth_1 = targetNoAuth; _c < targetNoAuth_1.length; _c++) {
        var target = targetNoAuth_1[_c];
        _loop_4(target);
    }
});
//# sourceMappingURL=auth_spec.js.map
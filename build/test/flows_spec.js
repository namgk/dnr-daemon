"use strict";
var auth_1 = require("../src/auth");
var flows_1 = require("../src/flows");
var fs = require("fs");
var chai_1 = require("chai");
describe("Test Flows", function () {
    var auth = null;
    var flowsApi = null;
    var testData = fs.readFileSync(__dirname + '/../../test/test_data.json', 'utf8');
    var testDataObj = JSON.parse(testData);
    var testConfig = fs.readFileSync(__dirname + '/../../test/test_configs.json', 'utf8');
    var testConfigObj = JSON.parse(testConfig);
    before(function (done) {
        var target = testConfigObj.auth_targets[0].TARGET;
        var user = testConfigObj.auth_targets[0].USER;
        var auth = new auth_1.default(target, user, process.env.NRPWD);
        auth.probeAuth().then(function (r) {
            flowsApi = new flows_1.default(auth);
            done();
        }).catch(function (e) {
            auth.auth().then(function (r) {
                flowsApi = new flows_1.default(auth);
                done();
            }).catch(done);
        });
    });
    it('install, delete flow', function (done) {
        var test_flow = testDataObj.inject_debug;
        flowsApi.installFlow(JSON.stringify(test_flow))
            .then(function (r) {
            var flow = JSON.parse(r);
            chai_1.expect(flow.id).to.not.undefined;
            flowsApi.uninstallFlow(flow.id).then(function (r) {
                done();
            }).catch(done);
        }).catch(done);
    });
    it('multiple installs', function (done) {
        var INSTALLS = [];
        var test_flow = testDataObj.inject_debug;
        var inject_only = testDataObj.inject_only;
        var installRequests = [];
        for (var i = 0; i < INSTALLS.length; i++) {
            installRequests.push(flowsApi.installFlow(JSON.stringify(test_flow))
                .then(function (r) {
                var flow = JSON.parse(r);
                return flow.id;
            }));
        }
        Promise.all(installRequests)
            .then(function (rs) {
            chai_1.expect(rs.length).to.equal(INSTALLS.length);
            var getRequests = [];
            for (var _i = 0, rs_1 = rs; _i < rs_1.length; _i++) {
                var r = rs_1[_i];
                getRequests.push(flowsApi.getFlow(r));
            }
            return Promise.all(getRequests);
        })
            .then(function (rss) {
            chai_1.expect(rss.length).to.equal(INSTALLS.length);
            done();
        })
            .catch(done);
    });
    it("install, get and delete flow", function (done) {
        var test_flow = testDataObj.inject_func_debug;
        flowsApi.installFlow(JSON.stringify(test_flow))
            .then(function (f) {
            var flow = JSON.parse(f);
            chai_1.expect(flow.id).to.not.undefined;
            return flow.id;
        })
            .then(function (fid) {
            return flowsApi.getFlow(fid);
        })
            .then(function (f) {
            var flow = JSON.parse(f);
            chai_1.expect(flow.id).to.not.undefined;
            chai_1.expect(flow.nodes).to.not.undefined;
            return flowsApi.uninstallFlow(flow.id);
        })
            .then(done)
            .catch(done);
    });
});
//# sourceMappingURL=flows_spec.js.map
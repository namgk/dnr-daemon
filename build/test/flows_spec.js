"use strict";
var auth_1 = require('../src/auth');
var flows_1 = require('../src/flows');
var fs = require('fs');
var chai_1 = require('chai');
describe("Test Flows", function () {
    var auth = null;
    var flowsApi = null;
    var testData = fs.readFileSync(__dirname + '/../../test/test_data.json', 'utf8');
    var testDataObj = JSON.parse(testData);
    var testConfig = fs.readFileSync(__dirname + '/../../test/test_configs.json', 'utf8');
    var testConfigObj = JSON.parse(testConfig);
    var testNodeInstalls = [
        'node-red-contrib-firebase-realtime-database',
        'node-red-contrib-pythonshell',
        'node-red-contrib-pythonshell'
    ];
    before(function (done) {
        var auth = null;
        if (testConfigObj.auth_targets.length > 0) {
            var target = testConfigObj.auth_targets[0].TARGET;
            var user = testConfigObj.auth_targets[0].USER;
            auth = new auth_1.default(target, user, process.env.NRPWD);
        }
        else if (testConfigObj.noauth_targets.length > 0) {
            var target = testConfigObj.noauth_targets[0];
            auth = new auth_1.default(target, '', '');
        }
        else {
            done('no target specified for the test!');
        }
        auth.probeAuth().then(function (r) {
            flowsApi = new flows_1.default(auth);
            done();
        }).catch(function (e) {
            auth.auth().then(function (r) {
                flowsApi = new flows_1.default(auth);
                var installRequests = [];
                for (var i = 0; i < testNodeInstalls.length; i++) {
                    installRequests.push(flowsApi.uninstallNode(testNodeInstalls[i]));
                }
                Promise.all(installRequests)
                    .then(function (r) {
                    done();
                })
                    .catch(function (e) {
                    done();
                });
            }).catch(done);
        });
    });
    after(function (done) {
        var installRequests = [];
        for (var i = 0; i < testNodeInstalls.length; i++) {
            installRequests.push(flowsApi.uninstallNode(testNodeInstalls[i]));
        }
        Promise.all(installRequests)
            .then(function (r) {
            done();
        })
            .catch(function (e) {
            done();
        });
    });
    it('install, uninstall node', function (done) {
        var test_node = testNodeInstalls[0];
        flowsApi.installNode(test_node)
            .then(function (r) {
            var installedModule = JSON.parse(r);
            chai_1.expect(installedModule.name).to.equal(test_node);
            chai_1.expect(installedModule.nodes.length).greaterThan(0);
            return flowsApi.uninstallNode(test_node);
        })
            .then(function (r) {
            done();
        }).catch(done);
    });
    it('uninstall, install a non exist node', function (done) {
        var test_node = testNodeInstalls[1];
        flowsApi.uninstallNode(test_node)
            .catch(function (uninstallResult) {
            chai_1.expect(uninstallResult.statusCode).to.equal(404);
            return flowsApi.installNode(test_node);
        })
            .then(function (r) {
            var installedModule = JSON.parse(r);
            chai_1.expect(installedModule.name).to.equal(test_node);
            chai_1.expect(installedModule.nodes.length).greaterThan(0);
            done();
        }).catch(done);
    });
    it('install an existing node', function (done) {
        var test_node = testNodeInstalls[2];
        flowsApi.installNode(test_node)
            .then(function (r) {
            var installedModule = JSON.parse(r);
            chai_1.expect(installedModule.name).to.equal(test_node);
            chai_1.expect(installedModule.nodes.length).greaterThan(0);
            return flowsApi.installNode(test_node);
        })
            .then(function (r) {
            done(1);
        })
            .catch(function (e) {
            console.log(e.statusMessage);
            chai_1.expect(e.statusMessage.indexOf('module_already_loaded')).to.greaterThan(-1);
            done();
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
"use strict";
var auth_1 = require('./auth');
var flows_1 = require('./flows');
var dnr_1 = require('./dnr');
var utils_1 = require('./utils');
var settings_1 = require('./settings');
var upstreamAuth = new auth_1.default(settings_1.default.UPSTREAM, settings_1.default.UPSTREAM_USER, settings_1.default.UPSTREAM_PASS);
var auth = new auth_1.default(settings_1.default.TARGET, settings_1.default.USER, settings_1.default.PASS);
upstreamAuth.auth().then(function () {
    main();
}).catch(console.log);
function main() {
    var upstreamFlowsApi = new flows_1.default(upstreamAuth);
    var flowsApi = new flows_1.default(auth);
    var auth1 = new auth_1.default(settings_1.default.TARGET1, settings_1.default.USER, settings_1.default.PASS);
    var auth2 = new auth_1.default(settings_1.default.TARGET2, settings_1.default.USER, settings_1.default.PASS);
    var auth3 = new auth_1.default(settings_1.default.TARGET3, settings_1.default.USER, settings_1.default.PASS);
    var auth4 = new auth_1.default(settings_1.default.TARGET4, settings_1.default.USER, settings_1.default.PASS);
    var auth5 = new auth_1.default(settings_1.default.TARGET5, settings_1.default.USER, settings_1.default.PASS);
    var flowsApi1 = new flows_1.default(auth1);
    var flowsApi2 = new flows_1.default(auth2);
    var flowsApi3 = new flows_1.default(auth3);
    var flowsApi4 = new flows_1.default(auth4);
    var flowsApi5 = new flows_1.default(auth5);
    var command = process.argv[2];
    if (command === 'getallflow') {
        upstreamFlowsApi.getFlows().then(function (r) {
            console.log(r);
        }).catch(function (e) {
            console.log(e);
        });
    }
    else if (command === 'getflow') {
        var flowId = process.argv[3];
        if (!flowId) {
            console.log('usage: npm start getflow <flowId>');
            process.exit();
        }
        upstreamFlowsApi.getFlow(flowId).then(function (r) {
            console.log(r);
        }).catch(function (e) {
            console.log(e);
        });
    }
    else if (command === 'deploy') {
        var flowId = process.argv[3];
        if (!flowId) {
            console.log('usage: npm start deploy <flowId>');
            process.exit();
        }
        upstreamFlowsApi.getFlow(flowId).then(function (r) {
            return JSON.parse(r);
        }).then(function (flow) {
            var renamed = {};
            for (var _i = 0, _a = flow.nodes; _i < _a.length; _i++) {
                var node = _a[_i];
                renamed[node.id] = utils_1.default.generateId();
                node.id = renamed[node.id];
            }
            for (var _b = 0, _c = flow.nodes; _b < _c.length; _b++) {
                var node = _c[_b];
                for (var i = 0; i < node.wires.length; i++) {
                    var wires = node.wires[i];
                    for (var j = 0; j < wires.length; j++) {
                        var w = wires[j];
                        wires[j] = renamed[w];
                    }
                    node.wires[i] = wires;
                }
            }
            var dnrizedFlow = dnr_1.default.dnrize(flow);
            return flowsApi5.installFlow(JSON.stringify(dnrizedFlow));
        }).then(function (rr) {
            console.log(rr);
        }).catch(function (e) {
            console.log(e);
        });
    }
    else if (command === 'deployAll') {
        var flowId = process.argv[3];
        if (!flowId) {
            console.log('usage: npm start deployAll <flowId>');
            process.exit();
        }
        upstreamFlowsApi.getFlow(flowId).then(function (r) {
            return JSON.parse(r);
        }).then(function (flow) {
            var renamed = {};
            for (var _i = 0, _a = flow.nodes; _i < _a.length; _i++) {
                var node = _a[_i];
                renamed[node.id] = utils_1.default.generateId();
                node.id = renamed[node.id];
            }
            for (var _b = 0, _c = flow.nodes; _b < _c.length; _b++) {
                var node = _c[_b];
                for (var i = 0; i < node.wires.length; i++) {
                    var wires = node.wires[i];
                    for (var j = 0; j < wires.length; j++) {
                        var w = wires[j];
                        wires[j] = renamed[w];
                    }
                    node.wires[i] = wires;
                }
            }
            return dnr_1.default.dnrize(flow);
        }).then(function (dnrizedFlow) {
            flowsApi1.installFlow(JSON.stringify(dnrizedFlow));
            return dnrizedFlow;
        }).then(function (dnrizedFlow) {
            flowsApi2.installFlow(JSON.stringify(dnrizedFlow));
            return dnrizedFlow;
        }).then(function (dnrizedFlow) {
            flowsApi3.installFlow(JSON.stringify(dnrizedFlow));
            return dnrizedFlow;
        }).then(function (dnrizedFlow) {
            return flowsApi4.installFlow(JSON.stringify(dnrizedFlow));
        }).catch(function (e) {
            console.log(e);
        });
    }
    else {
        console.log('usage: npm start <getflow|deploy|deployAll> <flowId>');
        process.exit();
    }
}
//# sourceMappingURL=demo.js.map
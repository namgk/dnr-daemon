"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("./auth");
const flows_1 = require("./flows");
const dnr_1 = require("./dnr");
const utils_1 = require("./utils");
const settings_1 = require("./settings");
var upstreamAuth = new auth_1.default(settings_1.default.UPSTREAM, settings_1.default.UPSTREAM_USER, settings_1.default.UPSTREAM_PASS);
var auth = new auth_1.default(settings_1.default.TARGET, settings_1.default.USER, settings_1.default.PASS);
upstreamAuth.auth().then(() => {
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
        upstreamFlowsApi.getFlows().then(r => {
            console.log(r);
        }).catch(e => {
            console.log(e);
        });
    }
    else if (command === 'getflow') {
        var flowId = process.argv[3];
        if (!flowId) {
            console.log('usage: npm start getflow <flowId>');
            process.exit();
        }
        upstreamFlowsApi.getFlow(flowId).then(r => {
            console.log(r);
        }).catch(e => {
            console.log(e);
        });
    }
    else if (command === 'deploy') {
        var flowId = process.argv[3];
        if (!flowId) {
            console.log('usage: npm start deploy <flowId>');
            process.exit();
        }
        upstreamFlowsApi.getFlow(flowId).then(r => {
            return JSON.parse(r);
        }).then(function (flow) {
            var renamed = {};
            for (let node of flow.nodes) {
                renamed[node.id] = utils_1.default.generateId();
                node.id = renamed[node.id];
            }
            for (let node of flow.nodes) {
                for (let i = 0; i < node.wires.length; i++) {
                    let wires = node.wires[i];
                    for (let j = 0; j < wires.length; j++) {
                        let w = wires[j];
                        wires[j] = renamed[w];
                    }
                    node.wires[i] = wires;
                }
            }
            var dnrizedFlow = dnr_1.default.dnrize(flow);
            return flowsApi5.installFlow(JSON.stringify(dnrizedFlow));
        }).then(rr => {
            console.log(rr);
        }).catch(e => {
            console.log(e);
        });
    }
    else if (command === 'deployAll') {
        var flowId = process.argv[3];
        if (!flowId) {
            console.log('usage: npm start deployAll <flowId>');
            process.exit();
        }
        upstreamFlowsApi.getFlow(flowId).then(r => {
            return JSON.parse(r);
        }).then(function (flow) {
            var renamed = {};
            for (let node of flow.nodes) {
                renamed[node.id] = utils_1.default.generateId();
                node.id = renamed[node.id];
            }
            for (let node of flow.nodes) {
                for (let i = 0; i < node.wires.length; i++) {
                    let wires = node.wires[i];
                    for (let j = 0; j < wires.length; j++) {
                        let w = wires[j];
                        wires[j] = renamed[w];
                    }
                    node.wires[i] = wires;
                }
            }
            return dnr_1.default.dnrize(flow);
        }).then(dnrizedFlow => {
            flowsApi1.installFlow(JSON.stringify(dnrizedFlow));
            return dnrizedFlow;
        }).then(dnrizedFlow => {
            flowsApi2.installFlow(JSON.stringify(dnrizedFlow));
            return dnrizedFlow;
        }).then(dnrizedFlow => {
            flowsApi3.installFlow(JSON.stringify(dnrizedFlow));
            return dnrizedFlow;
        }).then(dnrizedFlow => {
            return flowsApi4.installFlow(JSON.stringify(dnrizedFlow));
        }).catch(e => {
            console.log(e);
        });
    }
    else {
        console.log('usage: npm start <getflow|deploy|deployAll> <flowId>');
        process.exit();
    }
}
//# sourceMappingURL=demo.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const auth_1 = require("./auth");
const flows_1 = require("./flows");
const fs = require("fs");
const DNR_HOME = process.env.HOME + '/.dnr-daemon';
const CMD_GET_NODES = 'getnodes';
const CMD_INSTALL_NODE = 'installnode';
const CMD_UNINSTALL_NODE = 'uninstallnode';
const CMD_GET_FLOW = 'getflow';
const CMD_GET_FLOWS = 'getflows';
const CMD_DELETE_FLOW = 'uninstallflow';
const CMD_INSTALL_FLOW = 'installflow';
const CMD_TARGET = 'target';
var command = process.argv[2];
if (command !== CMD_INSTALL_NODE &&
    command !== CMD_UNINSTALL_NODE &&
    command !== CMD_GET_NODES &&
    command !== CMD_GET_FLOW &&
    command !== CMD_GET_FLOWS &&
    command !== CMD_INSTALL_FLOW &&
    command !== CMD_DELETE_FLOW &&
    command !== CMD_TARGET) {
    console.log('usage: npm start <' + CMD_GET_FLOW + '|'
        + CMD_GET_FLOWS + '|'
        + CMD_INSTALL_FLOW + '|'
        + CMD_DELETE_FLOW + '|'
        + CMD_INSTALL_NODE + '|'
        + CMD_UNINSTALL_NODE + '|'
        + CMD_TARGET + '>');
    process.exit();
}
if (command === CMD_TARGET) {
    if (process.argv.length !== 4 && process.argv.length !== 6) {
        console.log('usage: >npm start ' + CMD_TARGET + ' <target> [user] [pass]');
        process.exit();
    }
    let target = {
        host: process.argv[3]
    };
    if (process.argv.length === 6) {
        target.user = process.argv[4];
        target.pass = process.argv[5];
    }
    var auth = new auth_1.default(target.host, target.user, target.pass);
    auth.probeAuth()
        .catch(() => {
        return auth.auth();
    }).then(() => {
        fs.writeFileSync(DNR_HOME + '/target', process.argv[3]);
        console.log('target set - ' + process.argv[3]);
        process.exit();
    });
}
else {
    try {
        var target = fs.readFileSync(DNR_HOME + '/target', 'utf8');
        if (!target) {
            throw 'no target found';
        }
    }
    catch (e) {
        console.log('no target found, please run >npm start ' + CMD_TARGET + ' <target> [user] [pass]');
        process.exit();
    }
    var auth = new auth_1.default(target, "", "");
    auth.probeAuth().then(() => {
        main();
    }).catch(console.log);
}
function main() {
    var flowsApi = new flows_1.default(auth);
    if (command === CMD_GET_NODES) {
        flowsApi.getNodes().then(console.log).catch(console.log);
    }
    if (command === CMD_INSTALL_NODE) {
        let node = process.argv[3];
        if (!node) {
            console.log('usage: npm start ' + CMD_INSTALL_NODE + ' <node_name>');
            process.exit();
        }
        flowsApi.installNode(node).then(console.log).catch(console.log);
    }
    if (command === CMD_UNINSTALL_NODE) {
        let node = process.argv[3];
        if (!node) {
            console.log('usage: npm start ' + CMD_UNINSTALL_NODE + ' <node_name>');
            process.exit();
        }
        flowsApi.uninstallNode(node).then(console.log).catch(console.log);
    }
    if (command === CMD_GET_FLOWS) {
        flowsApi.getFlows().then(r => {
            console.log(r);
        }).catch(e => {
            console.log(e);
        });
    }
    if (command === CMD_GET_FLOW) {
        var flowId = process.argv[3];
        if (!flowId) {
            console.log('usage: npm start ' + CMD_GET_FLOW + ' <flow_id>');
            process.exit();
        }
        flowsApi.getFlow(flowId).then(console.log).catch(console.log);
    }
    if (command === CMD_DELETE_FLOW) {
        var flowId = process.argv[3];
        if (!flowId) {
            console.log('usage: npm start ' + CMD_DELETE_FLOW + ' <flow_id>');
            process.exit();
        }
        flowsApi.uninstallFlow(flowId).then(console.log).catch(console.log);
    }
    if (command === CMD_INSTALL_FLOW) {
        var flowJson = process.argv[3];
        if (!flowJson) {
            console.log('usage: npm start ' + CMD_INSTALL_FLOW + ' <flow_json>');
            process.exit();
        }
        flowsApi.installFlow(flowJson).then(console.log).catch(console.log);
    }
}
//# sourceMappingURL=index.js.map
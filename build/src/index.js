"use strict";
var auth_1 = require('./auth');
var flows_1 = require('./flows');
var fs = require('fs');
var DNR_HOME = process.env.HOME + '/.dnr-daemon';
var CMD_GET_NODES = 'getnodes';
var CMD_INSTALL_NODE = 'installnode';
var CMD_UNINSTALL_NODE = 'uninstallnode';
var CMD_GET_FLOW = 'getflow';
var CMD_GET_FLOWS = 'getflows';
var CMD_DELETE_FLOW = 'uninstallflow';
var CMD_INSTALL_FLOW = 'installflow';
var CMD_TARGET = 'target';
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
    var target_1 = {
        host: process.argv[3]
    };
    if (process.argv.length === 6) {
        target_1.user = process.argv[4];
        target_1.pass = process.argv[5];
    }
    var auth = new auth_1.default(target_1.host, target_1.user, target_1.pass);
    auth.probeAuth()
        .catch(function () {
        return auth.auth();
    }).then(function () {
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
    auth.probeAuth().then(function () {
        main();
    }).catch(console.log);
}
function main() {
    var flowsApi = new flows_1.default(auth);
    if (command === CMD_GET_NODES) {
        flowsApi.getNodes().then(console.log).catch(console.log);
    }
    if (command === CMD_INSTALL_NODE) {
        var node = process.argv[3];
        if (!node) {
            console.log('usage: npm start ' + CMD_INSTALL_NODE + ' <node_name>');
            process.exit();
        }
        flowsApi.installNode(node).then(console.log).catch(console.log);
    }
    if (command === CMD_UNINSTALL_NODE) {
        var node = process.argv[3];
        if (!node) {
            console.log('usage: npm start ' + CMD_UNINSTALL_NODE + ' <node_name>');
            process.exit();
        }
        flowsApi.uninstallNode(node).then(console.log).catch(console.log);
    }
    if (command === CMD_GET_FLOWS) {
        flowsApi.getFlows().then(function (r) {
            console.log(r);
        }).catch(function (e) {
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
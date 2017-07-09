"use strict";
var utils_1 = require('./utils');
var Dnr = (function () {
    function Dnr() {
    }
    Dnr.dnrize = function (original) {
        var dnrized = JSON.parse(JSON.stringify(original));
        var nodesList = dnrized.nodes;
        var nodesMap = new Map();
        for (var _i = 0, nodesList_1 = nodesList; _i < nodesList_1.length; _i++) {
            var node = nodesList_1[_i];
            var nodeId = node.id;
            if (!nodesMap.get(nodeId)) {
                nodesMap.set(nodeId, node);
            }
        }
        var addingDnrNodes = [];
        var dnrGateway = {
            id: utils_1.default.generateId(),
            config: {
                status: 'not implemented!',
                flow: 'should be dnrized flow'
            },
            z: dnrized.id,
            type: 'dnr-gateway'
        };
        for (var _a = 0, nodesList_2 = nodesList; _a < nodesList_2.length; _a++) {
            var node = nodesList_2[_a];
            var nodeId = node.id;
            var nodeConstraints = node.constraints;
            if (nodeConstraints) {
                var linkConstraints = nodeConstraints.link;
            }
            for (var output in node.wires) {
                var wires = node.wires[output];
                for (var i = 0; i < wires.length; i++) {
                    var linkType = void 0;
                    if (linkConstraints) {
                        linkType = linkConstraints[output + '_' + wires[i]] || linkType;
                    }
                    var dnrNode = {
                        id: utils_1.default.generateId(),
                        type: 'dnr',
                        z: node.z,
                        wires: [[wires[i]]],
                        linkType: linkType,
                        input: nodeId + '_' + output,
                        gateway: dnrGateway.id,
                        x: Math.round((node.x + nodesMap.get(wires[i]).x) / 2),
                        y: Math.round((node.y + nodesMap.get(wires[i]).y) / 2)
                    };
                    wires[i] = dnrNode.id;
                    addingDnrNodes.push(dnrNode);
                }
            }
        }
        dnrized.nodes = nodesList.concat(addingDnrNodes);
        dnrGateway.config.flow = JSON.parse(JSON.stringify(dnrized));
        if (addingDnrNodes.length > 0) {
            dnrized.nodes.push(dnrGateway);
        }
        dnrized.label = 'dnr_' + dnrized.id;
        return dnrized;
    };
    return Dnr;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Dnr;
//# sourceMappingURL=dnr.js.map
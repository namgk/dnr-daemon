"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
class Dnr {
    static dnrize(original) {
        var dnrized = JSON.parse(JSON.stringify(original));
        var nodesList = dnrized.nodes;
        var nodesMap = new Map();
        for (let node of nodesList) {
            let nodeId = node.id;
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
        for (let node of nodesList) {
            let nodeId = node.id;
            let nodeConstraints = node.constraints;
            if (nodeConstraints) {
                var linkConstraints = nodeConstraints.link;
            }
            for (let output in node.wires) {
                let wires = node.wires[output];
                for (let i = 0; i < wires.length; i++) {
                    let linkType;
                    if (linkConstraints) {
                        linkType = linkConstraints[output + '_' + wires[i]] || linkType;
                    }
                    let dnrNode = {
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
    }
}
exports.default = Dnr;
//# sourceMappingURL=dnr.js.map
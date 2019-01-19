"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs = require("fs");
const chai_1 = require("chai");
const dnr_1 = require("../src/dnr");
describe("Test Dnr", function () {
    var testData = fs.readFileSync(__dirname + '/../../test/test_data.json', 'utf8');
    var testDataObj = JSON.parse(testData);
    for (let key in testDataObj) {
        let test_flow = testDataObj[key];
        it("correctly dnrize this flow: " + key, function () {
            var dnrized = dnr_1.default.dnrize(test_flow);
            chai_1.expect(dnrized.label.startsWith('dnr_') && dnrized.label.endsWith(test_flow.id));
            var dnrGateway = [];
            var originalNodesMap = new Map();
            for (let node of test_flow.nodes) {
                let nodeId = node.id;
                if (!originalNodesMap.get(nodeId)) {
                    originalNodesMap.set(nodeId, node);
                }
            }
            var dnrizedNodesMap = new Map();
            for (let node of dnrized.nodes) {
                if (node.type === 'dnr-gateway') {
                    dnrGateway.push(node.id);
                }
                let nodeId = node.id;
                if (!dnrizedNodesMap.get(nodeId)) {
                    dnrizedNodesMap.set(nodeId, node);
                }
            }
            var pairs = [];
            for (let node of test_flow.nodes) {
                let nodeWires = node.wires;
                for (let i = 0; i < nodeWires.length; i++) {
                    for (let j = 0; j < nodeWires[i].length; j++) {
                        pairs.push([node.id, i, nodeWires[i][j]]);
                    }
                }
            }
            var noOfDnrNodes = 0;
            for (let pair of pairs) {
                let sourceNode = dnrizedNodesMap.get(pair[0]);
                let sourceOutput = pair[1];
                let destNode = dnrizedNodesMap.get(pair[2]);
                for (let i = 0; i < sourceNode.wires[sourceOutput].length; i++) {
                    let output = sourceNode.wires[sourceOutput][i];
                    let dnrNode = dnrizedNodesMap.get(output);
                    chai_1.expect(dnrNode.type).to.equal('dnr');
                    chai_1.expect(dnrNode.wires.length).to.equal(1);
                    chai_1.expect(dnrNode.wires[0].length).to.equal(1);
                    chai_1.expect(dnrNode.input).to.equal(sourceNode.id + '_' + sourceOutput);
                    chai_1.expect(dnrNode.gateway).to.equal(dnrGateway[0]);
                    if (dnrNode.wires[0][0] === destNode.id) {
                        noOfDnrNodes++;
                    }
                }
            }
            chai_1.expect(noOfDnrNodes).to.equal(pairs.length);
            chai_1.expect(dnrGateway.length).to.equal(noOfDnrNodes > 0 ? 1 : 0);
        });
    }
});
//# sourceMappingURL=dnr_spec.js.map
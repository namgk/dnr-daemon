"use strict";
var fs = require('fs');
var chai_1 = require('chai');
var dnr_1 = require('../src/dnr');
describe("Test Dnr", function () {
    var testData = fs.readFileSync(__dirname + '/../../test/test_data.json', 'utf8');
    var testDataObj = JSON.parse(testData);
    var _loop_1 = function(key) {
        var test_flow = testDataObj[key];
        it("correctly dnrize this flow: " + key, function () {
            var dnrized = dnr_1.default.dnrize(test_flow);
            chai_1.expect(dnrized.label.startsWith('dnr_') && dnrized.label.endsWith(test_flow.id));
            var dnrGateway = [];
            var originalNodesMap = new Map();
            for (var _i = 0, _a = test_flow.nodes; _i < _a.length; _i++) {
                var node = _a[_i];
                var nodeId = node.id;
                if (!originalNodesMap.get(nodeId)) {
                    originalNodesMap.set(nodeId, node);
                }
            }
            var dnrizedNodesMap = new Map();
            for (var _b = 0, _c = dnrized.nodes; _b < _c.length; _b++) {
                var node = _c[_b];
                if (node.type === 'dnr-gateway') {
                    dnrGateway.push(node.id);
                }
                var nodeId = node.id;
                if (!dnrizedNodesMap.get(nodeId)) {
                    dnrizedNodesMap.set(nodeId, node);
                }
            }
            var pairs = [];
            for (var _d = 0, _e = test_flow.nodes; _d < _e.length; _d++) {
                var node = _e[_d];
                var nodeWires = node.wires;
                for (var i = 0; i < nodeWires.length; i++) {
                    for (var j = 0; j < nodeWires[i].length; j++) {
                        pairs.push([node.id, i, nodeWires[i][j]]);
                    }
                }
            }
            var noOfDnrNodes = 0;
            for (var _f = 0, pairs_1 = pairs; _f < pairs_1.length; _f++) {
                var pair = pairs_1[_f];
                var sourceNode = dnrizedNodesMap.get(pair[0]);
                var sourceOutput = pair[1];
                var destNode = dnrizedNodesMap.get(pair[2]);
                for (var i = 0; i < sourceNode.wires[sourceOutput].length; i++) {
                    var output = sourceNode.wires[sourceOutput][i];
                    var dnrNode = dnrizedNodesMap.get(output);
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
    };
    for (var key in testDataObj) {
        _loop_1(key);
    }
});
//# sourceMappingURL=dnr_spec.js.map
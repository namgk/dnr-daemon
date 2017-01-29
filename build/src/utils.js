"use strict";
var Utils = (function () {
    function Utils() {
    }
    Utils.nodesEqual = function (node1, node2) {
        if (node1.id === node2.id &&
            node1.type === node2.type &&
            node1.z === node2.z) {
            return true;
        }
        else {
            return false;
        }
    };
    Utils.generateId = function () {
        return (1 + Math.random() * 4294967295).toString(16);
    };
    return Utils;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Utils;
//# sourceMappingURL=utils.js.map
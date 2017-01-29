"use strict";
var TestClass = (function () {
    function TestClass() {
    }
    TestClass.aStaticMethod = function (a) {
        return { a: a, b: 2 };
    };
    TestClass.prototype.promiseTest = function () {
        var p = new Promise(function (f, r) {
            f(1);
        });
        return p;
    };
    return TestClass;
}());
TestClass.STATIC_VAR = 1;
TestClass.PRIV_STATIC_VAR = {};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = TestClass;
//# sourceMappingURL=testClass.js.map
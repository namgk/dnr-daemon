"use strict";
var Settings = (function () {
    function Settings() {
    }
    return Settings;
}());
Settings.TARGET = 'http://localhost:1443';
Settings.USER = 'admin';
Settings.PASS = process.env.NRPWD;
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Settings;
//# sourceMappingURL=settings.js.map
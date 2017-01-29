"use strict";
var Settings = (function () {
    function Settings() {
    }
    return Settings;
}());
Settings.TARGET = 'http://localhost:1880';
Settings.USER = 'admin';
Settings.PASS = process.env.NRPWD;
Settings.UPSTREAM = 'http://localhost:1880';
Settings.UPSTREAM_USER = 'admin';
Settings.UPSTREAM_PASS = process.env.NRPWD;
Settings.TARGET1 = 'http://localhost:1880';
Settings.TARGET2 = 'http://localhost:2880';
Settings.TARGET3 = 'http://localhost:3880';
Settings.TARGET4 = 'http://localhost:4880';
Settings.TARGET5 = 'http://localhost:5880';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Settings;
//# sourceMappingURL=settings.js.map
"use strict";
var request = require("request-promise-native");
var clone = require("clone");
var FlowsAPI = (function () {
    function FlowsAPI(auth) {
        this.auth = auth;
        this.authOpt = {
            baseUrl: auth.getHost(),
            uri: '',
            headers: {
                'Content-type': 'application/json'
            }
        };
        if (auth.getToken() && auth.getToken() !== 'noauth') {
            this.authOpt.headers['Authorization'] = 'Bearer ' + auth.getToken();
        }
    }
    FlowsAPI.prototype.setAuth = function (auth) {
        this.auth = auth;
    };
    FlowsAPI.prototype.getFlows = function () {
        var obj = this;
        var opt = clone(obj.authOpt);
        opt.uri = FlowsAPI.FLOW_RESOURCE + 's';
        return new Promise(function (f, r) {
            request(opt)
                .then(function (body) {
                f(body);
            })
                .catch(function (er) {
                r({ error: er.error, statusCode: er.statusCode, statusMessage: er.message });
            });
        });
    };
    FlowsAPI.prototype.getFlow = function (id) {
        var obj = this;
        var opt = clone(obj.authOpt);
        opt.uri = FlowsAPI.FLOW_RESOURCE + '/' + id;
        return new Promise(function (f, r) {
            request(opt)
                .then(function (body) {
                f(body);
            })
                .catch(function (er) {
                r({ error: er.error, statusCode: er.statusCode, statusMessage: er.message });
            });
        });
    };
    FlowsAPI.prototype.uninstallFlow = function (id) {
        var obj = this;
        var opt = clone(obj.authOpt);
        opt.uri = FlowsAPI.FLOW_RESOURCE + '/' + id;
        opt.method = 'DELETE';
        return new Promise(function (f, r) {
            request(opt)
                .then(function (body) {
                f(body);
            })
                .catch(function (er) {
                r({ error: er.error, statusCode: er.statusCode, statusMessage: er.message });
            });
        });
    };
    FlowsAPI.prototype.updateFlow = function (id, flow) {
        var obj = this;
        var opt = clone(obj.authOpt);
        opt.uri = FlowsAPI.FLOW_RESOURCE + '/' + id;
        opt.body = flow;
        opt.method = 'PUT';
        return new Promise(function (f, r) {
            request(opt)
                .then(function (body) {
                f(body);
            })
                .catch(function (er) {
                r({ error: er.error, statusCode: er.statusCode, statusMessage: er.message });
            });
        });
    };
    FlowsAPI.prototype.installFlow = function (flow) {
        var obj = this;
        var opt = clone(obj.authOpt);
        opt.uri = FlowsAPI.FLOW_RESOURCE;
        opt.body = flow;
        opt.method = 'POST';
        return new Promise(function (f, r) {
            request(opt)
                .then(function (body) {
                f(body);
            })
                .catch(function (er) {
                r({ error: er.error, statusCode: er.statusCode, statusMessage: er.message });
            });
        });
    };
    return FlowsAPI;
}());
FlowsAPI.FLOW_RESOURCE = '/flow';
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = FlowsAPI;
//# sourceMappingURL=flows.js.map
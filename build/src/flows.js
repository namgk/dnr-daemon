"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const request = require("request-promise-native");
const clone = require("clone");
class FlowsAPI {
    constructor(auth) {
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
    setAuth(auth) {
        this.auth = auth;
    }
    getNodes() {
        let obj = this;
        let opt = clone(obj.authOpt);
        opt.uri = FlowsAPI.NODES_RESOURCE;
        opt.headers['accept'] = 'application/json';
        return new Promise(function (f, r) {
            request(opt)
                .then((body) => {
                f(body);
            })
                .catch(function (er) {
                r({ error: er.error, statusCode: er.statusCode, statusMessage: er.message });
            });
        });
    }
    installNode(node) {
        let obj = this;
        let opt = clone(obj.authOpt);
        opt.uri = FlowsAPI.NODES_RESOURCE;
        opt.body = JSON.stringify({
            "module": node
        });
        opt.method = 'POST';
        return new Promise(function (f, r) {
            request(opt)
                .then((body) => {
                f(body);
            })
                .catch(function (er) {
                r({ error: er.error, statusCode: er.statusCode, statusMessage: er.message });
            });
        });
    }
    uninstallNode(node) {
        let obj = this;
        let opt = clone(obj.authOpt);
        opt.uri = FlowsAPI.NODES_RESOURCE + '/' + node;
        opt.method = 'DELETE';
        return new Promise(function (f, r) {
            request(opt)
                .then((body) => {
                f(body);
            })
                .catch(function (er) {
                r({ error: er.error, statusCode: er.statusCode, statusMessage: er.message });
            });
        });
    }
    getFlows() {
        let obj = this;
        let opt = clone(obj.authOpt);
        opt.uri = FlowsAPI.FLOW_RESOURCE + 's';
        return new Promise(function (f, r) {
            request(opt)
                .then((body) => {
                f(body);
            })
                .catch(function (er) {
                r({ error: er.error, statusCode: er.statusCode, statusMessage: er.message });
            });
        });
    }
    getFlow(id) {
        let obj = this;
        let opt = clone(obj.authOpt);
        opt.uri = FlowsAPI.FLOW_RESOURCE + '/' + id;
        return new Promise(function (f, r) {
            request(opt)
                .then((body) => {
                f(body);
            })
                .catch(function (er) {
                r({ error: er.error, statusCode: er.statusCode, statusMessage: er.message });
            });
        });
    }
    uninstallFlow(id) {
        let obj = this;
        let opt = clone(obj.authOpt);
        opt.uri = FlowsAPI.FLOW_RESOURCE + '/' + id;
        opt.method = 'DELETE';
        return new Promise(function (f, r) {
            request(opt)
                .then((body) => {
                f(body);
            })
                .catch(function (er) {
                r({ error: er.error, statusCode: er.statusCode, statusMessage: er.message });
            });
        });
    }
    updateFlow(id, flow) {
        let obj = this;
        let opt = clone(obj.authOpt);
        opt.uri = FlowsAPI.FLOW_RESOURCE + '/' + id;
        opt.body = flow;
        opt.method = 'PUT';
        return new Promise(function (f, r) {
            request(opt)
                .then((body) => {
                f(body);
            })
                .catch(function (er) {
                r({ error: er.error, statusCode: er.statusCode, statusMessage: er.message });
            });
        });
    }
    installFlow(flow) {
        let obj = this;
        let opt = clone(obj.authOpt);
        opt.uri = FlowsAPI.FLOW_RESOURCE;
        opt.body = flow;
        opt.method = 'POST';
        return new Promise(function (f, r) {
            request(opt)
                .then((body) => {
                f(body);
            })
                .catch(function (er) {
                r({ error: er.error, statusCode: er.statusCode, statusMessage: er.message });
            });
        });
    }
}
FlowsAPI.FLOW_RESOURCE = '/flow';
FlowsAPI.NODES_RESOURCE = '/nodes';
exports.default = FlowsAPI;
//# sourceMappingURL=flows.js.map
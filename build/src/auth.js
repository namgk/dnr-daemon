"use strict";
var request = require('request');
var fs = require('fs');
var Auth = (function () {
    function Auth(host, username, password) {
        this.nodeRedHost = host;
        this.username = username;
        this.password = password;
        console.log(host);
        this.hostString = host.split('//')[1].replace(':', '_').replace('/', '');
        var obj = this;
        try {
            if (!fs.existsSync(Auth.DNR_HOME)) {
                fs.mkdirSync(Auth.DNR_HOME);
            }
            obj.token = fs.readFileSync(Auth.DNR_HOME + '/token_' + this.hostString, 'utf8');
        }
        catch (e) { }
    }
    Auth.prototype.getToken = function () {
        return this.token;
    };
    Auth.prototype.getHost = function () {
        return this.nodeRedHost;
    };
    Auth.prototype.probeAuth = function () {
        var obj = this;
        return new Promise(function (f, r) {
            var optNoAuth = {
                baseUrl: obj.nodeRedHost,
                uri: Auth.A_PRIVATE_RESOURCE
            };
            request.get(optNoAuth, function (er, res, body) {
                if (er) {
                    return r(er);
                }
                if (res.statusCode == 200) {
                    obj.token = 'noauth';
                    return f(body);
                }
                if (!obj.token) {
                    return r(body);
                }
                var opt = {
                    baseUrl: obj.nodeRedHost,
                    uri: Auth.A_PRIVATE_RESOURCE,
                    headers: { 'Authorization': 'Bearer ' + obj.token }
                };
                request.get(opt, function (er2, res2, body) {
                    if (er2) {
                        return r(er2);
                    }
                    if (res2.statusCode == 200) {
                        f(body);
                    }
                    else {
                        r(body);
                    }
                });
            });
        });
    };
    Auth.prototype.auth = function () {
        var obj = this;
        return new Promise(function (f, r) {
            var opt = {
                baseUrl: obj.nodeRedHost,
                uri: Auth.TOKEN_PATH,
                headers: { 'content-type': 'application/x-www-form-urlencoded' },
                body: 'client_id=node-red-admin&grant_type=password&scope=*&username=' + obj.username + '&password=' + obj.password
            };
            request.post(opt, function (er, res, body) {
                if (er || body === 'Unauthorized') {
                    return r(er + ' ' + body);
                }
                obj.token = JSON.parse(body).access_token;
                if (!obj.token) {
                    return r(body);
                }
                try {
                    fs.writeFileSync(Auth.DNR_HOME + '/token_' + obj.hostString, obj.token);
                }
                catch (e) { }
                f(obj.token);
            });
        });
    };
    Auth.DNR_HOME = process.env.HOME + '/.dnr-daemon';
    Auth.TOKEN_PATH = '/auth/token';
    Auth.A_PRIVATE_RESOURCE = '/settings';
    return Auth;
}());
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = Auth;
//# sourceMappingURL=auth.js.map
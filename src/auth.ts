import request = require('request');
import assert = require('assert');
import fs = require('fs');

export default class Auth {
  nodeRedHost: string
  username: string
  password: string
  token: string
  private static DNR_HOME: string = process.env.HOME+ '/.dnr-daemon'
  private static TOKEN_PATH: string = '/auth/token'
  private static A_PRIVATE_RESOURCE: string = '/settings'

  constructor(host: string, username: string, password: string) {
    this.nodeRedHost = host;
    this.username = username;
    this.password = password;

    let obj = this
    try {
      obj.token = fs.readFileSync(Auth.DNR_HOME + '/token', 'utf8');
    } catch (e){}
  }

  public getToken(): string {
    return this.token
  }

  public getHost(): string {
    return this.nodeRedHost
  }

  public probeAuth(): Promise<boolean> {
    let obj = this
    return new Promise<boolean>(function(f,r){
      if (!obj.token){
        return r(true)
      }

      const opt: request.OptionsWithUri = {
        baseUrl: obj.nodeRedHost,
        uri: Auth.A_PRIVATE_RESOURCE,
        headers: {'Authorization' : 'Bearer ' + obj.token}
      };

      request.get(opt, (er, res, body) => {
        if (res.statusCode == 200){
          f(true)
        } else {
          r(true)
        }
      })
    })
  }

  public auth(): Promise<string> {
    let obj = this
    return new Promise<string>(function(f,r){
      const opt: request.OptionsWithUri = {
        baseUrl: obj.nodeRedHost,
        uri: Auth.TOKEN_PATH,
        headers: {'content-type' : 'application/x-www-form-urlencoded'},
        body: 'client_id=node-red-admin&grant_type=password&scope=*&username=' + obj.username + '&password=' + obj.password
      };

      request.post(opt, (er, res, body) => {
        if (!er && body != 'Unauthorized'){
          obj.token = JSON.parse(body).access_token
          fs.writeFileSync(Auth.DNR_HOME + '/token', obj.token);
          f(obj.token)
        } else {
          r(er)
        }
      })
    })
  }

}
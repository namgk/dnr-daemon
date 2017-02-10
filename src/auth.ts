import request = require('request');
import assert = require('assert');
import fs = require('fs');

export default class Auth {
  nodeRedHost: string
  hostString: string
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
    this.hostString = host.split('//')[1].replace(':','_').replace('/','')

    let obj = this

    try {
      if (!fs.existsSync(Auth.DNR_HOME)){
        fs.mkdirSync(Auth.DNR_HOME);
      }
      obj.token = fs.readFileSync(Auth.DNR_HOME + '/token_' + this.hostString, 'utf8');
    } catch (e){console.log(e)}
  }

  public getToken(): string {
    return this.token
  }

  public getHost(): string {
    return this.nodeRedHost
  }

  public probeAuth(): Promise<string> {
    let obj = this

    return new Promise<string>(function(f,r){
      const optNoAuth: request.OptionsWithUri = {
        baseUrl: obj.nodeRedHost,
        uri: Auth.A_PRIVATE_RESOURCE
      };

      request.get(optNoAuth, (er, res, body) => {
        if (er){
          return r(er)
        }

        if (res.statusCode == 200){
          obj.token = 'noauth'
          return f(body)
        }

        if (!obj.token){
          return r(body)
        }

        const opt: request.OptionsWithUri = {
          baseUrl: obj.nodeRedHost,
          uri: Auth.A_PRIVATE_RESOURCE,
          headers: {'Authorization' : 'Bearer ' + obj.token}
        };

        request.get(opt, (er2, res2, body) => {
          if (er2){
            return r(er2)
          }
          
          if (res2.statusCode == 200){
            f(body)
          } else {
            r(body)
          }
        })
        
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
        if (er || body === 'Unauthorized'){
          return r(er + ' ' + body)
        }

        obj.token = JSON.parse(body).access_token

        if (!obj.token){
          return r(body)
        }

        try {
          fs.writeFileSync(Auth.DNR_HOME + '/token_' + obj.hostString, obj.token);
        } catch (e){}

        f(obj.token)
      })
    })
  }

}
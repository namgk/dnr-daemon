import request = require('request');
import assert = require('assert');

export default class Auth {
  nodeRedHost: string
  username: string
  password: string
  private static TOKEN_PATH: string = '/auth/token'
  private static A_PRIVATE_RESOURCE: string = '/settings'

  constructor(host: string, username: string, password: string) {
    this.nodeRedHost = host;
    this.username = username;
    this.password = password;
  }

  public auth(): Promise<boolean> {
    let obj = this
    return new Promise<boolean>(function(f,r){
      const opt: request.OptionsWithUri = {
        baseUrl: obj.nodeRedHost,
        uri: Auth.TOKEN_PATH,
        body: 'client_id=node-red-admin&grant_type=password&scope=*&username=' + obj.username + '&password=' + obj.password
      };

      request.post(opt, (er, res, body) => {
        console.log("1111")
        if (!er && body != 'Unauthorized'){
          f(true)
        } else {
          f(er)
        }
      })
    })
  }

}
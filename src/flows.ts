import request = require('request');
import assert = require('assert');
import fs = require('fs');
import Auth from './auth'

export default class FlowsAPI {
  private auth: Auth
  private authOpt : request.OptionsWithUri
  private static FLOW_RESOURCE: string = '/flow'

  constructor(auth: Auth) {
    this.auth = auth
    this.authOpt = {
      baseUrl: auth.getHost(),
      uri: '',
      headers: {
        'Content-type' : 'application/json'
      }
    }
    if (auth.getToken() && auth.getToken() !== 'noauth'){
      this.authOpt.headers['Authorization'] = 'Bearer ' + auth.getToken()
    }
  }

  public setAuth(auth: Auth){
    this.auth = auth
  }

  public getAllFlow(): Promise<string> {
    let obj = this
    return new Promise<string>(function(f,r){
      obj.authOpt.uri = FlowsAPI.FLOW_RESOURCE + 's'
      request.get(obj.authOpt, (er, res, body) => {
        if (res && res.statusCode == 200){
          f(body)
        } else {
          r({error: er, body: body, statusCode: res.statusCode, statusMessage: res.statusMessage})
        }
      })
    })
  }

  public getFlow(id: string): Promise<string> {
    let obj = this
    return new Promise<string>(function(f,r){
      obj.authOpt.uri = FlowsAPI.FLOW_RESOURCE + '/' + id
      request.get(obj.authOpt, (er, res, body) => {
        if (res && res.statusCode == 200){
          f(body)
        } else {
          r({error: er, body: body, statusCode: res.statusCode, statusMessage: res.statusMessage})
        }
      })
    })
  }


  public uninstallFlow(id: string): Promise<string> {
    let obj = this
    return new Promise<string>(function(f,r){
      obj.authOpt.uri = FlowsAPI.FLOW_RESOURCE + '/' + id
      request.del(obj.authOpt, (er, res, body) => {
        if (res && res.statusCode == 204){
          f(body)
        } else {
          r({error: er, body: body, statusCode: res.statusCode, statusMessage: res.statusMessage})
        }
      })
    })
  }

  public installFlow(flow: string): Promise<string> {
    let obj = this
    return new Promise<string>(function(f,r){
      obj.authOpt.uri = FlowsAPI.FLOW_RESOURCE
      obj.authOpt.body = flow
      request.post(obj.authOpt, (er, res, body) => {
        delete obj.authOpt.body
        if (res && res.statusCode == 200){
          f(body)
        } else {
          r({error: er, body: body, statusCode: res.statusCode, statusMessage: res.statusMessage})
        }
      })
    })
  }

}
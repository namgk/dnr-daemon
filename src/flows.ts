import request = require('request-promise-native');
import assert = require('assert');
import clone = require('clone');
import fs = require('fs');
import Auth from './auth'

export default class FlowsAPI {
  private auth: Auth
  private authOpt : request.OptionsWithUri
  private static FLOW_RESOURCE: string = '/flow'
  private static NODES_RESOURCE: string = '/nodes'

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

  public getNodes(): Promise<string> {
    let obj = this
    let opt = clone(obj.authOpt)
    opt.uri = FlowsAPI.NODES_RESOURCE
    opt.headers['accept']= 'application/json'
    return new Promise<string>(function(f,r){
      request(opt)
      .then((body) => {
        f(body)
      })
      .catch(function (er) {
        r({error: er.error, statusCode: er.statusCode, statusMessage: er.message})
      })
    })
  }

  public installNode(node: string): Promise<string> {
    let obj = this
    let opt = clone(obj.authOpt)
    opt.uri = FlowsAPI.NODES_RESOURCE
    opt.body = JSON.stringify({
      "module": node
    })
    opt.method = 'POST'
    return new Promise<string>(function(f,r){
      request(opt)
      .then((body) => {
        f(body)
      })
      .catch(function (er) {
        r({error: er.error, statusCode: er.statusCode, statusMessage: er.message})
      })
    })
  }

  public uninstallNode(node: string): Promise<string> {
    let obj = this
    let opt = clone(obj.authOpt)
    opt.uri = FlowsAPI.NODES_RESOURCE + '/' + node
    opt.method = 'DELETE'
    return new Promise<string>(function(f,r){
      request(opt)
      .then((body) => {
        f(body)
      })
      .catch(function (er) {
        r({error: er.error, statusCode: er.statusCode, statusMessage: er.message})
      })
    })
  }

  public getFlows(): Promise<string> {
    let obj = this
    let opt = clone(obj.authOpt)
    opt.uri = FlowsAPI.FLOW_RESOURCE + 's'
    return new Promise<string>(function(f,r){
      request(opt)
      .then((body) => {
        f(body)
      })
      .catch(function (er) {
        r({error: er.error, statusCode: er.statusCode, statusMessage: er.message})
      })
    })
  }

  public getFlow(id: string): Promise<string> {
    let obj = this
    let opt = clone(obj.authOpt)
    opt.uri = FlowsAPI.FLOW_RESOURCE + '/' + id
    return new Promise<string>(function(f,r){
      request(opt)
      .then((body) => {
        f(body)
      })
      .catch(function (er) {
        r({error: er.error, statusCode: er.statusCode, statusMessage: er.message})
      })
    })
  }

  public uninstallFlow(id: string): Promise<string> {
    let obj = this
    let opt = clone(obj.authOpt)
    opt.uri = FlowsAPI.FLOW_RESOURCE + '/' + id
    opt.method = 'DELETE'
    return new Promise<string>(function(f,r){
      request(opt)
      .then((body) => {
        f(body)
      })
      .catch(function (er) {
        r({error: er.error, statusCode: er.statusCode, statusMessage: er.message})
      })
    })
  }

  public updateFlow(id: string, flow: string): Promise<string> {
    let obj = this
    let opt = clone(obj.authOpt)
    opt.uri = FlowsAPI.FLOW_RESOURCE + '/' + id
    opt.body = flow
    opt.method = 'PUT'
    return new Promise<string>(function(f,r){
      request(opt)
      .then((body) => {
        f(body)
      })
      .catch(function (er) {
        r({error: er.error, statusCode: er.statusCode, statusMessage: er.message})
      })
    })
  }

  public installFlow(flow: string): Promise<string> {
    let obj = this
    let opt = clone(obj.authOpt)
    opt.uri = FlowsAPI.FLOW_RESOURCE
    opt.body = flow
    opt.method = 'POST'
    return new Promise<string>(function(f,r){
      request(opt)
      .then((body) => {
        f(body)
      })
      .catch(function (er) {
        r({error: er.error, statusCode: er.statusCode, statusMessage: er.message})
      })
    })
  }

}
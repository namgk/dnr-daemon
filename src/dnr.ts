import request = require('request');
import assert = require('assert');
import fs = require('fs');
import Auth from './auth'
import Utils from './utils'

export default class Dnr {

  public static dnrize(original: any) : any {
    var dnrized = JSON.parse(JSON.stringify(original));
    var nodesList = dnrized.nodes

    // mapify
    var nodesMap : Map<string,any> = new Map<string, any>()
    for (let node of nodesList){
      let nodeId = node.id
      if (!nodesMap.get(nodeId)){
        nodesMap.set(nodeId, node)
      }
    }

    var addingDnrNodes : any[] = []
    var dnrGateway = {
      id: Utils.generateId(),
      config: {
        status: 'not implemented!',
        flow: 'should be dnrized flow'
      },
      z: dnrized.id,
      type: 'dnr-gateway'
    }

    for (let node of nodesList){
      let nodeId = node.id
      let nodeConstraints = node.constraints
      if (nodeConstraints){
        var linkConstraints = nodeConstraints.link
      }

      for (let output in node.wires){
        let wires = node.wires[output]
        for (let i = 0; i < wires.length; i++){
          let linkType
          if (linkConstraints){
            linkType = linkConstraints[output+'_'+wires[i]] || linkType
          }
          let dnrNode = {
            id: Utils.generateId(),
            type: 'dnr',
            z: node.z,
            wires:[[wires[i]]],
            linkType: linkType,
            input: nodeId + '_' + output,
            gateway: dnrGateway.id,
            x: Math.round( (node.x + nodesMap.get(wires[i]).x) / 2 ),
            y: Math.round( (node.y + nodesMap.get(wires[i]).y) / 2 )
          }

          wires[i] = dnrNode.id
          addingDnrNodes.push(dnrNode)
        }
      }
    }

    // adding new dnr nodes to the config
    // dnr gateway (configuration of dnr nodes) needs to contain
    // the dnrized flow with dnr nodes, this will exclude itself

    // step 1
    dnrized.nodes = nodesList.concat(addingDnrNodes)

    // step 2
    dnrGateway.config.flow = JSON.parse(JSON.stringify(dnrized))

    // step 3: in case no dnr node to be added, skip adding the gateway
    if (addingDnrNodes.length > 0){
      dnrized.nodes.push(dnrGateway)
    }

    // step 4: keep original flow ID by rewriting the label
    // because when deployed, new flow Id will be generated
    // also distinguish between dnrized flows and normal flows
    dnrized.label = 'dnr_' + dnrized.id

    return dnrized
  }
}
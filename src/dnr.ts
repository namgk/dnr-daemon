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

    for (let node of nodesList){
      let nodeId = node.id
      let nodeWires = node.wires

      for (let wires of nodeWires){
        for (let i = 0; i < wires.length; i++){
          let dnrNode = {
            id: Utils.generateId(),
            type: 'dnr',
            z: node.z,
            wires:[[wires[i]]],
            input: nodeId,
            x: Math.round( (node.x + nodesMap.get(wires[i]).x) / 2 ),
            y: Math.round( (node.y + nodesMap.get(wires[i]).y) / 2 )
          }

          wires[i] = dnrNode.id
          addingDnrNodes.push(dnrNode)
        }
      }
    }

    dnrized.nodes = nodesList.concat(addingDnrNodes)
    return dnrized
  }
}
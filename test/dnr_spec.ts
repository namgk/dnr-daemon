import fs = require('fs');
import {expect} from 'chai';

import Dnr from '../src/dnr';
import Utils from '../src/utils'

describe("Test Dnr", function () {
  var testData = fs.readFileSync(__dirname + '/../../test/test_data.json', 'utf8')
  var testDataObj = JSON.parse(testData)

  for (let key in testDataObj){
    let test_flow = testDataObj[key]

    it("correctly dnrize this flow: " + key, function(){
      var dnrized = Dnr.dnrize(test_flow)
      var dnrGateway : string[]= []
      // mapify
      var originalNodesMap : Map<string,any> = new Map<string, any>()
      for (let node of test_flow.nodes){
        let nodeId = node.id
        if (!originalNodesMap.get(nodeId)){
          originalNodesMap.set(nodeId, node)
        }
      }
      var dnrizedNodesMap : Map<string,any> = new Map<string, any>()
      for (let node of dnrized.nodes){
        if (node.type === 'dnr-gateway'){
          dnrGateway.push(node.id)
        }
        let nodeId = node.id
        if (!dnrizedNodesMap.get(nodeId)){
          dnrizedNodesMap.set(nodeId, node)
        }
      }

      // check if original flow is correctly dnrized
      // it is if there is a dnr node in between every pair of nodes
      var pairs : any[]= []
      for (let node of test_flow.nodes){
        let nodeWires = node.wires
        for (let i = 0; i < nodeWires.length; i++){
          for (let j = 0; j < nodeWires[i].length; j++){
            pairs.push([node.id, i, nodeWires[i][j]])
          }
        }
      }

      var noOfDnrNodes = 0
      for (let pair of pairs){
        let sourceNode = dnrizedNodesMap.get(pair[0])
        let sourceOutput = pair[1]
        let destNode = dnrizedNodesMap.get(pair[2])

        for (let i = 0; i < sourceNode.wires[sourceOutput].length; i++){
          let output = sourceNode.wires[sourceOutput][i]
          let dnrNode = dnrizedNodesMap.get(output)
          expect(dnrNode.type).to.equal('dnr')
          expect(dnrNode.wires.length).to.equal(1)
          expect(dnrNode.wires[0].length).to.equal(1)
          expect(dnrNode.input).to.equal(sourceNode.id + '_' + sourceOutput)
          expect(dnrNode.gateway).to.equal(dnrGateway[0])

          if (dnrNode.wires[0][0] === destNode.id){
            noOfDnrNodes++
          }
        }
      }
      // 1 extra dnr gateway (configuration) node
      expect(noOfDnrNodes).to.equal(pairs.length)
      expect(dnrGateway.length).to.equal(noOfDnrNodes > 0 ? 1 : 0)
    });
  }
})

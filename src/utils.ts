export default class Utils {
  public static nodesEqual(node1: any, node2: any){
    // 2 nodes are equal if they
    // 1. have same type
    // 3. have same id
    // 4. belong to same flow

    if (node1.id === node2.id &&
        node1.type === node2.type &&
        node1.z === node2.z){
      return true
    } else {
      return false
    }
  }

  public static generateId() : string {
    return (1+Math.random()*4294967295).toString(16);
  }
}
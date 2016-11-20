import Auth from '../src/auth';
import FlowsAPI from '../src/flows';

// let = block

let auth: Auth = new Auth('http://seawolf1.westgrid.ca:1880', 'admin', process.env.NRPWD);
let flowsApi: FlowsAPI = new FlowsAPI(auth)

flowsApi.getFlow('ee9eb93b.35e2d8').then(r=>{
  console.log(r)
})

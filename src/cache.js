var Q = require('q');

var cache = function() {
  this.CPU = 0;
  this.MEM = 0;
  this.BAT = 0;
  this.LAT = 0;
  this.LON = 0;

  setInterval(()=>{
    queryCpu().then((cpu)=>{
      this.CPU = cpu;
    });

  },2000)
};

function queryCpu(){
  var d = Q.defer();

  var cpu = Math.round(Math.random()*100)/100;
  d.resolve(cpu*100);

  return d.promise;
}

module.exports = new cache();
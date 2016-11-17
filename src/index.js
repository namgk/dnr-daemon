var db = require("./db");
var config = require('./config');
var cache = require('./cache');
var dnr = require('./dnr');
var Log = require('kb-logger');

var log = Log.createLogger('DNR-Daemon');
log.setFile(config.LOG_FILE);
log.setLevel(config.LOG_LEVEL);

// start context engine - acquisition, upload, query
// look at flow, checking context, register ctx query

// update device context with tracker
setInterval(()=>{
  db.ref(config.DEVICE_ID).update({
    latitude: 44,
    longitude: -123,
    cpu: cache.CPU,
    mem: cache.MEM,
    bat: cache.BAT
  })
},2000);

db.ref(config.FLOW_TOPIC).on("value", function(snapshot) {
  var flowsUrl = snapshot.val();
  if (!flowsUrl){
    return;
  }

  log.info(flowsUrl);
  ref.update(null);

  log.debug('downloading config from ' + flowsUrl);
  dnr.downloadConfig(flowsUrl, function(config){
    log.debug('redeploying config to ' + config.LOCAL_NODERED);
    dnr.redeployConfig(dnr.dnrizeConfig(JSON.parse(config)), config.LOCAL_NODERED + '/flows');
  })
});

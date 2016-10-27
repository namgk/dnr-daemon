var config = function() {
  switch(process.env.NODE_ENV){
    case 'dev':
      return {
        FLOW_TOPIC: 'new_flow',
        DEVICE_ID: '1880',
        FIREBASE_CONFIG: 'firebase_key.json',
        FIREBASE_URL: 'https://dnr-tracker.firebaseio.com',
        LOG_FILE: process.env.LOG_FILE ||  '/Users/namtrang/.dnr-daemon/log',
        LOG_LEVEL: process.env.LOG_LEVEL ||  0,
        LOCAL_NODERED: "http://localhost:1880"
      };

    case 'stage':
      return {
      };

    case 'prod':
      return {
      };

    default:
      return {
        FLOW_TOPIC: 'new_flow',
      	DEVICE_ID: 'device_id_7583',
      	FIREBASE_CONFIG: 'firebase_key.json',
      	FIREBASE_URL: 'https://dnr-tracker.firebaseio.com',
        LOG_FILE: process.env.LOG_FILE ||  '/Users/namtrang/.dnr-daemon/log',
        LOG_LEVEL: process.env.LOG_LEVEL ||  2,
        LOCAL_NODERED: "http://localhost:1880"
      };
  }
};
module.exports = new config();
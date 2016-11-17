var firebase = require("firebase");
var config = require('./config');
var cache = require('./cache');

firebase.initializeApp({
  serviceAccount: config.FIREBASE_CONFIG,
  databaseURL: config.FIREBASE_URL
});

var db = firebase.database();
module.exports=db;
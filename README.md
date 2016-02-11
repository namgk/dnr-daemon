# dnr-daemon: Distributed Node-RED (DNR) enabler for Node-RED
To be run with vanilla Node-RED on the same machine to add DNR functionalities.

DNR Daemon subscribes to an MQTT topic to be notified whenever new DNR flows are available from master flow editor. It parses the new flows based on flows constraints and redeployed the DNR-parsed flows onto vanilla Node-RED.

# Run instruction
Install and run Node-RED: <http://nodered.org/>

Modify settings.js to correspond with the Node-RED installation.

$ npm install -g dnr-daemon

$ dnr-daemon

You might need:

$ sudo npm install -g node-red-contrib-dnr

to install the special DNRNode used in DNR. Node-RED restart is required for new nodes to be registered.

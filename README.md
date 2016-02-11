# dnr-daemon: Distributed Node-RED (DNR) enabler for Node-RED
To be run with vanilla Node-RED on the same machine to add DNR functionalities.

DNR Daemon subscribes to an MQTT topic to be notified whenever new DNR flows are available from master flow editor. It parses the new flows based on flows constraints and redeployed the DNR-parsed flows onto vanilla Node-RED.

//Sudo Code for the building entry prototype on the individual's side
var scanResults = {
	found: false,
	Devices: []
};
while(true){
	scan = scanForDevices();
	if(scan.found){
		for (var i = 0, length = scan.Devices.length; i < length; i++){
			bluetoothPair(scan.Devices[i]);	
			sendBlueTooth(myID.address);
			var msg = bluetoothMSG();

			createTransaction(msg.address, msg.phrase);
			openWebSocket(myID.address);
			conn.onmessage = function (ev) {
			  var transaction = JSON.parse(ev.data);
				if(transaction.payload.transaction == undefined){
					console.log("heartbeat")
				}
				else{
					if (confirmTransaction(transaction)){
						screen.log("DING! You have been successfully verified")
					}
					else{
						var reasons = extractReasonOP_R(transaction)
						screen.log("You have been denied! Reasons are: " + reasons);
					}
				}
			}
		}
	}
};

////////////////////////////////////////////////////////////////////////
//From the Organization's point of view
////////////////////////////////////////////////////////////////////////
var scanResults = {
	found: false,
	Devices: []
};
while(true){
	scan = scanForDevices();
	if(scan.found){
		for (var i = 0, length = scan.Devices.length; i < length; i++){
			bluetoothPair(scan.Devices[i]);	
			var msg = bluetoothMSG();
			if (confirmAccess(msg.address)){
				var phrase = rand.generate();
				sendBlueTooth(building.address, phrase);

				openWebSocket(building.address);
				conn.onmessage = function (ev) {
				  var transaction = JSON.parse(ev.data);
					if(transaction.payload.transaction == undefined){
						console.log("heartbeat")
					}
					else{
						if (confirmTransaction(transaction)){
							createTransaction(msg.address, confirmation);
							openDoor();
							console.log("Welcome " + msg.address.name);
						}
						else{
							createTransaction(msg.address, denial, reasons);
							console.log("Access Denied");
						}
					}
				}	
			}	
			else{

			}
		}
	}
};
//Pseudocode for the building entry prototype on the individual's side
var scanResults = {
	found: false,
	Devices: []
};
while(true){
	//constantly scan for device in the vicinity 
	scan = scanForDevices();
	//if the scan found device or devices
	if(scan.found){
		//loop through each of the connected devices
		for (var i = 0, length = scan.Devices.length; i < length; i++){
			//pair with the device
			bluetoothPair(scan.Devices[i]);	
			//send the device my ID's address
			sendBlueTooth(myID.address);
			//place bluetooth response in variable
			var msg = bluetoothMSG();
			//create a transaction to the organization's address with the phrase they gave us
			createTransaction(msg.address, msg.phrase);
			//monitor our address for a new transaction from the organization to us
			openWebSocket(myID.address);
			conn.onmessage = function (ev) {
			  var transaction = JSON.parse(ev.data);
			  //disregard irrevlavent transactions
				if(transaction.payload.transaction == undefined || 
					transaction.payload.transaction.address != msg.address){
					console.log("heartbeat")
				}
				else{
					//look at the transaction and confirm that we have been granted access
					if (confirmTransaction(transaction)){
						screen.log("DING! You have been successfully verified")
					}
					else{
						//print out the reasons we were denied
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
	//constantly scan for device in the vicinity 
	scan = scanForDevices();
	//if scan found devices then execute
	if(scan.found){
		//go through each device
		for (var i = 0, length = scan.Devices.length; i < length; i++){
			//pair using bluetooth with the device
			bluetoothPair(scan.Devices[i]);	
			//place recieved msg in a variable do confirm the person does have acces
			var msg = bluetoothMSG();
			if (confirmAccess(msg.address)){
				//send the secret phrase that is randomly generated 
				//for this season to device over Bluetooth
				var phrase = rand.generate();
				sendBlueTooth(building.address, phrase);
				//monitor your own address for new transactions
				openWebSocket(building.address);
				conn.onmessage = function (ev) {
				  var transaction = JSON.parse(ev.data);
				  //ignore irrelavent transactions
					if(transaction.payload.transaction == undefined|| 
					transaction.payload.transaction.address != msg.address)){
						console.log("heartbeat")
					}
					else{
						//confirm or deny the access based on the phrase that was sent back
						if (confirmTransaction(transaction)){
							createTransaction(msg.address, confirmation);
							//OPEN THE DOOR
							openDoor();
							//Greet the person in a creepy fashion
							console.log("Welcome " + msg.address.name);
						}
						else{
							//deny them access and log it in the block chain
							createTransaction(msg.address, denial, reasons);
							console.log("Access Denied");
						}
					}
				}	
			}	
		}
	}
};
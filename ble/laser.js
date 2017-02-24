var Laser = function()
{

	var obj = 
	{
		onMeasure : function(value)
		{
			console.log(value);
		},
		onConnect : function(name)
		{
			console.log(name);
		},
		init : function()
		{
			self = this;
			window.navigator.bluetooth.requestDevice({ 
				filters: [{
					services: ['3ab10100-f831-4395-b29d-570977d5bf94']
				}]	
			})
			.then(device => device.gatt.connect())
			.then(server => {
				self.onConnect(server.device.name);
				return server.getPrimaryService('3ab10100-f831-4395-b29d-570977d5bf94');
			})
			.then(service => {
				return service.getCharacteristic('3ab10101-f831-4395-b29d-570977d5bf94');
			})
			.then(characteristic =>{
				console.log("1:" + characteristic);
				characteristic.indicate = true;
				characteristic.notify = true;
				characteristic.startNotifications();
				characteristic.addEventListener('characteristicvaluechanged',
				  function(event){
					var val = (event.target.value.getFloat32(0,true));
					if(self.onMeasure != undefined)
					{
						self.onMeasure(val);
				  	}
				  });

			})
			.catch(error => { console.log(error); });			
		},
	}
	return obj;
};

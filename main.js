//https://web.dev/i18n/es/bluetooth/#connect
  //https://googlechrome.github.io/samples/web-bluetooth/discover-services-and-characteristics.html?optionalServices=e
  //https://developer.mozilla.org/en-US/docs/Web/API/Bluetooth/requestDevice
  //https://googlechrome.github.io/samples/web-bluetooth/read-characteristic-value-changed.html
var bluetoothDevice;
var bluetoothDeviceCharacteristicRedLED;
var bluetoothDeviceCharacteristicGreenLED;
var bluetoothDeviceCharacteristicBlueLED;
var statusLED;

function onConnectBLEdevice() {
  return (bluetoothDevice ? Promise.resolve() : requestDevice())
  .then(connectDeviceAndCacheCharacteristics)
  .catch(error => {
    console.log('onConnectBLEdevice Argh! ' + error);
    console.log(error);
  });
}

function requestDevice() {
  console.log('Requesting any Bluetooth Device with 19b10000-e8f2-537e-4f6c-d104768a1214 service...');
  return navigator.bluetooth.requestDevice({
      filters: [{name: 'LED'}],//<- Prefer filters to save energy & show relevant devices.
     // acceptAllDevices: true,
      optionalServices: ['19b10000-e8f2-537e-4f6c-d104768a1214']})
  .then(device => {
    bluetoothDevice = device;
    bluetoothDevice.addEventListener('gattserverdisconnected', onDisconnected);
  });
}


function connectDeviceAndCacheCharacteristics() {
  if (bluetoothDevice.gatt.connected && bluetoothDeviceCharacteristic) {
    return Promise.resolve();
  }

  console.log('Connecting to GATT Server...');
  return bluetoothDevice.gatt.connect()
  .then(server => {
    console.log('Getting LED Service...');
    return server.getPrimaryService('19b10000-e8f2-537e-4f6c-d104768a1214');
  })
  .then(service => {
    console.log('Getting red LED Characteristic...');
   // Get all characteristics.
    return service.getCharacteristics();
  })
  .then(characteristics => {
    console.log('> Characteristics: ' +
      characteristics.map(c => c.uuid).join('\n' + ' '.repeat(19)));
      console.log(characteristics)
      console.log(characteristics[0])
  //for (var i = 0; i < characteristics.length; i++) {
      bluetoothDeviceCharacteristicRedLED = characteristics[0];
      bluetoothDeviceCharacteristicGreenLED = characteristics[1];
      bluetoothDeviceCharacteristicBlueLED = characteristics[2];
     //}
  })
  .catch(error => {
    console.log('Argh! ' + error);
  });
}

/* This function will be called when `readValue` resolves and
 * characteristic value changes since `characteristicvaluechanged` event
 * listener has been added. */

function onDisconnected() {
  console.log('> Bluetooth Device disconnected');
  connectDeviceAndCacheCharacteristics()
  .catch(error => {
   console.log('Argh! ' + error);
  });
}

function onTurnOnRedLed(){
     aux=new Int8Array(1);
    aux[0]=1;
    return (bluetoothDeviceCharacteristicRedLED.writeValue(aux))
  .then(_ => {
    console.log('onTurnOnRedLed');
  })
  .catch(error => {
    console.log('Argh! ' + error);
  });
}

function onTurnOnGreenLed(){
     aux=new Int8Array(1);
    aux[0]=1;
    return (bluetoothDeviceCharacteristicGreenLED.writeValue(aux))
  .then(_ => {
    console.log('onTurnOnGreenLed');
  })
  .catch(error => {
    console.log('Argh! ' + error);
  });
}

function onTurnOnBlueLed(){
     aux=new Int8Array(1);
    aux[0]=1;
    return (bluetoothDeviceCharacteristicBlueLED.writeValue(aux))
  .then(_ => {
    console.log('onTurnOnBlueLed');
  })
  .catch(error => {
    console.log('Argh! ' + error);
  });
}

function onTurnOffRedLed(){
     aux=new Int8Array(1);
    aux[0]=0;
    return (bluetoothDeviceCharacteristicRedLED.writeValue(aux))
  .then(_ => {
    console.log('onTurnOffRedLed');
  })
  .catch(error => {
    console.log('Argh! ' + error);
  });
}

function onTurnOffGreenLed(){
     aux=new Int8Array(1);
    aux[0]=0;
    return (bluetoothDeviceCharacteristicGreenLED.writeValue(aux))
  .then(_ => {
    console.log('onTurnOffGreenLed');
  })
  .catch(error => {
    console.log('Argh! ' + error);
  });
}

function onTurnOffBlueLed(){
     aux=new Int8Array(1);
    aux[0]=0;
    return (bluetoothDeviceCharacteristicBlueLED.writeValue(aux))
  .then(_ => {
    console.log('onTurnOffBlueLed');
  })
  .catch(error => {
    console.log('Argh! ' + error);
  });
}


//https://web.dev/i18n/es/bluetooth/#connect
  //https://googlechrome.github.io/samples/web-bluetooth/discover-services-and-characteristics.html?optionalServices=e
  //https://developer.mozilla.org/en-US/docs/Web/API/Bluetooth/requestDevice
  //https://googlechrome.github.io/samples/web-bluetooth/read-characteristic-value-changed.html
var bluetoothDevice;
var bluetoothDeviceCharacteristic;
var statusLED;

function onConnectBLEdevice() {
  return (bluetoothDevice ? Promise.resolve() : requestDevice())
  .then(connectDeviceAndCacheCharacteristics)
  .catch(error => {
    console.log('onConnectBLEdevice Argh! ' + error);
    console.log(error);
  });
}

function onReadBLEcharacteristic(){
     console.log('Reading LED status...');
    return (bluetoothDeviceCharacteristic.readValue())
  .then(_ => {
    console.log('LED status value:');
    statusLED=bluetoothDeviceCharacteristic.value.getInt8();
    console.log(statusLED);
  })
  .catch(error => {
    console.log('onConnectBLEdevice Argh! ' + error);
    console.log(error);
  }); 
}

function onWriteBLEcharacteristic(){
     console.log('Writting LED status...');
     statusLED++;
     aux=new Int8Array(1);
    aux[0]=statusLED;
    return (bluetoothDeviceCharacteristic.writeValue(aux))
  .then(_ => {
    console.log('> Characteristic User Description changed to: ' + Int8Array);
  })
  .catch(error => {
    console.log('Argh! ' + error);
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
    console.log('Getting LED Characteristic...');
    return service.getCharacteristic('19b10001-e8f2-537e-4f6c-d104768a1214');
  })
  .then(characteristic => {
    bluetoothDeviceCharacteristic = characteristic;
    //batteryLevelCharacteristic.addEventListener('characteristicvaluechanged',handleBatteryLevelChanged);
    //document.querySelector('#startNotifications').disabled = false;
    //document.querySelector('#stopNotifications').disabled = true;
  });
}

/* This function will be called when `readValue` resolves and
 * characteristic value changes since `characteristicvaluechanged` event
 * listener has been added. */

function onResetButtonClick() {
  if (bluetoothDeviceCharacteristic) {
    bluetoothDeviceCharacteristic.removeEventListener('characteristicvaluechanged',
        bluetoothDeviceCharacteristic);
    bluetoothDeviceCharacteristic = null;
  }
  // Note that it doesn't disconnect device.
  bluetoothDevice = null;
  console.log('> Bluetooth Device reset');
}

function onDisconnected() {
  console.log('> Bluetooth Device disconnected');
  connectDeviceAndCacheCharacteristics()
  .catch(error => {
   console.log('Argh! ' + error);
  });
}

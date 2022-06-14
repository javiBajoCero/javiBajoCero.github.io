//https://web.dev/i18n/es/bluetooth/#connect
  //https://googlechrome.github.io/samples/web-bluetooth/discover-services-and-characteristics.html?optionalServices=e
  //https://developer.mozilla.org/en-US/docs/Web/API/Bluetooth/requestDevice
  //https://googlechrome.github.io/samples/web-bluetooth/read-characteristic-value-changed.html
function onButtonClick() {

  console.log('Requesting any Bluetooth Device...');
  navigator.bluetooth.requestDevice({
   // filters: [...] <- Prefer filters to save energy & show relevant devices.
      acceptAllDevices: true,
      optionalServices: ['battery_service']})
  .then(device => {
    console.log('Connecting to GATT Server...');
    return device.gatt.connect();
  })
  .then(server => {
    // Note that we could also get all services that match a specific UUID by
    // passing it to getPrimaryServices().
    console.log('Getting Services...');
    return server.getPrimaryServices();
  })
  .then(services => {
    console.log('Getting Characteristics...');
    let queue = Promise.resolve();
    services.forEach(service => {
      queue = queue.then(_ => service.getCharacteristics().then(characteristics => {
        console.log('> Service: ' + service.uuid);
        characteristics.forEach(characteristic => {
          console.log('>> Characteristic: ' + characteristic.uuid + ' ' +
              getSupportedProperties(characteristic));
        });
      }));
    });
    return queue;
  })
  .catch(error => {
    console.log('Argh! ' + error);
  });
}
  
  /* Utils */

function getSupportedProperties(characteristic) {
  let supportedProperties = [];
  for (const p in characteristic.properties) {
    if (characteristic.properties[p] === true) {
      supportedProperties.push(p.toUpperCase());
    }
  }
  return '[' + supportedProperties.join(', ') + ']';
}

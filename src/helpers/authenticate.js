import TouchID from 'react-native-touch-id';

const optionalConfigObject = {
  title: 'Authentication Required',
  imageColor: '#e00606',
  imageErrorColor: '#ff0000',
  sensorDescription: 'Touch sensor',
  sensorErrorDescription: 'Failed',
  cancelText: 'Cancel',
  fallbackLabel: 'Show Passcode',
  unifiedErrors: false,
  passcodeFallback: true,
};

export function open() {
  return TouchID.authenticate(
    'to demo this react-native component',
    optionalConfigObject,
  )
    .then(success => {
      return true;
    })
    .catch(error => {
      return false;
    });
}

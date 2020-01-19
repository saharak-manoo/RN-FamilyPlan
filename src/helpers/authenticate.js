import TouchID from 'react-native-touch-id';
import I18n from '../components/i18n';

export function open(message, isOpenPasscode = true) {
  let optionalConfigObject = {
    title: I18n.t('text.authenticationRequired'),
    imageColor: '#e00606',
    imageErrorColor: '#ff0000',
    sensorDescription: 'Touch sensor',
    sensorErrorDescription: I18n.t('message.error'),
    cancelText: I18n.t('button.cancel'),
    fallbackLabel: I18n.t('text.showPasscode'),
    unifiedErrors: true,
    passcodeFallback: isOpenPasscode,
  };

  return TouchID.authenticate(message, optionalConfigObject)
    .then(success => {
      return {isPassed: true, error: ''};
    })
    .catch(error => {
      return {isPassed: false, error: error};
    });
}

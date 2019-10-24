'use strict';
import I18n from 'react-native-i18n';

I18n.fallbacks = true;
I18n.translations = {
  en: require('../translations/en'),
  th: require('../translations/th')
};

export default I18n;
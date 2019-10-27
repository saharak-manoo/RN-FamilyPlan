import React, { Component } from 'react';
import {
  Provider as PaperProvider,
  Appbar
} from 'react-native-paper';
import NavigatorView from './Navigator/NavigatorView';
import FlashMessage from 'react-native-flash-message';
import RNRestart from 'react-native-restart';
import AsyncStorage from '@react-native-community/async-storage';
import I18n from '../components/i18n';

export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  async componentWillMount() {
    await AsyncStorage.getItem('locale')
      .then(language => {
        if (language == null) { language = 'en' }
        I18n.locale = language;
      });
  }

  render() {
    return (
      <PaperProvider>
        <NavigatorView />
        <FlashMessage position='top' />
      </PaperProvider >
    );
  }
};
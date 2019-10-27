import React, { Component } from 'react';
import {
  Provider as PaperProvider,
  Appbar
} from 'react-native-paper';
import NavigatorView from './Navigator/NavigatorView';
import FlashMessage from 'react-native-flash-message';

export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount = async () => {
    let locale = await AsyncStorage.getItem('locale');
    if (locale == null) {
      locale = 'en'
    }
    this.setState((I18n.locale = locale))
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
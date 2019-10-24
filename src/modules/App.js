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

  render() {
    return (
      <PaperProvider>
        <NavigatorView />
        <FlashMessage position='top' />
      </PaperProvider>
    );
  }
};
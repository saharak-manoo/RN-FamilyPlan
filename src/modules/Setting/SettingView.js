import React, { Component } from 'react';
import {
  StatusBar,
  View
} from 'react-native';
import {
  Appbar,
  Text
} from 'react-native-paper';

export default class SettingView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  AppHerder() {
    return (
      <View>
        <StatusBar backgroundColor="#6D06F9" barStyle="light-content" />
        <Appbar.Header style={{ backgroundColor: '#6D06F9' }}>
          <Appbar.Content
            title="Setting"
          />
        </Appbar.Header>
      </View>
    )
  }

  render() {
    return (
      <View>
        {this.AppHerder()}
        <Text>Setting</Text>
      </View>
    );
  }
};
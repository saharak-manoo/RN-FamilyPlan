import React, { Component } from 'react';
import {
  StatusBar,
  View
} from 'react-native';
import {
  Appbar,
  Text
} from 'react-native-paper';

export default class Home extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  AppHerder() {
    return (
      <View>
        <StatusBar backgroundColor="#2370E6" barStyle="light-content" />
        <Appbar.Header style={{ backgroundColor: '#2370E6' }}>
          <Appbar.Content
            title="Home"
          />
        </Appbar.Header>
      </View>
    )
  }

  render() {
    return (
      <View>
        {this.AppHerder()}
        <Text>Home</Text>
      </View>
    );
  }
};
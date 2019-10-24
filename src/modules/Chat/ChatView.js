import React, { Component } from 'react';
import {
  StatusBar,
  View
} from 'react-native';
import {
  Appbar,
  Text
} from 'react-native-paper';

export default class Chat extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  AppHerder() {
    return (
      <View>
        <StatusBar backgroundColor='#09A650' barStyle='light-content' />
        <Appbar.Header style={{ backgroundColor: '#09A650' }}>
          <Appbar.Content
            title='Chat'
          />
        </Appbar.Header>
      </View>
    )
  }

  render() {
    return (
      <View>
        {this.AppHerder()}
        <Text>Chat</Text>
      </View>
    );
  }
};
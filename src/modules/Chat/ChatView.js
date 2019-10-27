import React, { Component } from 'react';
import {
  StatusBar,
  View
} from 'react-native';
import {
  Appbar,
  Text
} from 'react-native-paper';
import I18n from '../../components/i18n';

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
            title={I18n.t('message.chat')}
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
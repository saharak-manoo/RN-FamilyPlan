import React, {Component} from 'react';
import {StatusBar, View} from 'react-native';
import {Appbar, Text} from 'react-native-paper';
import I18n from '../../components/i18n';

export default class NotificationView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  AppHerder() {
    return (
      <View>
        <StatusBar backgroundColor="#F93636" barStyle="light-content" />
        <Appbar.Header style={{backgroundColor: '#F93636'}}>
          <Appbar.Content title={I18n.t('placeholder.notifications')} />
        </Appbar.Header>
      </View>
    );
  }

  render() {
    return (
      <View>
        {this.AppHerder()}
        <Text>Notification</Text>
      </View>
    );
  }
}

import React, { Component } from 'react';
import {
  Modal,
  StatusBar,
  View
} from 'react-native';
import {
  Appbar,
  Text
} from 'react-native-paper';
import I18n from '../../components/i18n';

export default class GroupView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  AppHerder() {
    return (
      <View>
        <StatusBar backgroundColor={this.props.group.color} barStyle='light-content' />
        <Appbar.Header style={{ backgroundColor: this.props.group.color }}>
          <Appbar.Action icon='close' onPress={() => this.props.back()} />
          <Appbar.Content
            title={I18n.t('placeholder.group')}
          />
        </Appbar.Header>
      </View>
    )
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.AppHerder()}
        <View style={{ padding: 45 }}>
          <Text style={{ alignItems: 'center', fontSize: 58 }}>Family Plan</Text>
        </View>
      </View>
    );
  }
};
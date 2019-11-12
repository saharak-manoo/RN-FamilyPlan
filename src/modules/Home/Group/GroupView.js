import React, {Component} from 'react';
import {Modal, StatusBar, View} from 'react-native';
import {Appbar, Text} from 'react-native-paper';
import I18n from '../../../components/i18n';

export default class GroupView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {};
    this.params = this.props.navigation.state.params;
  }

  AppHerder() {
    return (
      <View>
        <StatusBar backgroundColor="#2370E6" barStyle="light-content" />
        <Appbar.Header style={{backgroundColor: '#2370E6'}}>
          <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content title={this.params.group.name} />
        </Appbar.Header>
      </View>
    );
  }

  render() {
    return (
      <View style={{flex: 1}}>
        {this.AppHerder()}
        <View style={{padding: 45}}>
          <Text style={{alignItems: 'center', fontSize: 58}}>Family Plan</Text>
        </View>
      </View>
    );
  }
}

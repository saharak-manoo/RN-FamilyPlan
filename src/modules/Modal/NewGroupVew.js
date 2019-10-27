import React, { Component } from 'react';
import {
  StatusBar,
  View,
} from 'react-native';
import {
  Appbar,
  Text,
  TextInput
} from 'react-native-paper';
import I18n from '../../components/i18n';
import { Icon } from 'react-native-elements'
import * as Api from '../../util/Api'
import * as GFunction from '../../util/GlobalFunction'

export default class NewGroupView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={{ padding: 30 }}>
        <Text style={{ fontSize: 30 }}>{I18n.t('message.newGroup')}</Text>
        <View style={{ paddingTop: 15 }}>
          <TextInput
            style={{ backgroundColor: '#FFF' }}
            label={I18n.t('placeholder.name')}
            value={this.state.groupName}
            onChangeText={groupName => this.setState({ groupName: groupName })}
          />
        </View>

        <View style={{ paddingTop: 20 }}>
          <Text style={{ fontSize: 30 }}>{I18n.t('message.members')}</Text>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <TextInput
                style={{ backgroundColor: '#FFF' }}
                label={I18n.t('placeholder.email')}
                value={this.state.groupName}
                onChangeText={groupName => this.setState({ groupName: groupName })}
              />
            </View>

            <View>
              <Icon
                size={15}
                reverse
                name='ios-remove'
                type='ionicon'
                color='#F60645'
              />
            </View>
          </View>

          <View style={{ flexDirection: 'row' }}>
            <View style={{ flex: 1 }}>
              <TextInput
                style={{ backgroundColor: '#FFF' }}
                label={I18n.t('placeholder.email')}
                value={this.state.groupName}
                onChangeText={groupName => this.setState({ groupName: groupName })}
              />
            </View>

            <View>
              <Icon
                size={15}
                reverse
                name='ios-remove'
                type='ionicon'
                color='#F60645'
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
};
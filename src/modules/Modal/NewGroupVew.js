import React, { Component } from 'react';
import {
  Dimensions,
  Platform,
  StatusBar,
  View,
} from 'react-native';
import {
  Appbar,
  Text,
  TextInput
} from 'react-native-paper';
import I18n from '../../components/i18n';
import { Dropdown } from 'react-native-material-dropdown';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import { Icon } from 'react-native-elements'
import * as Api from '../../util/Api'
import * as GFunction from '../../util/GlobalFunction'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class NewGroupView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      services: [
        {
          value: I18n.t('text.appleMusic'),
          en: 'appleMusic'
        },
        {
          value: I18n.t('text.disneyPlus'),
          en: 'disneyPlus'
        },
        {
          value: I18n.t('text.netflix'),
          en: 'netflix'
        },
        {
          value: I18n.t('text.spotify'),
          en: 'spotify'
        }
      ],
      service: I18n.t('text.appleMusic')
    };
  }

  clickCreateGroup() {
    this.loadingCreateGroup.showLoading(true);
    setTimeout(() => {
      if (this.props.modal.current) {
        this.loadingJoinGroup.showLoading(false);
        GFunction.successMessage(I18n.t('message.success'), I18n.t('message.createGroupSuccessful'))
        this.props.modal.current.close();
      }
    }, 1000)
  }

  render() {
    return (
      <View style={{ flex: 1, padding: 30 }}>
        <Text style={{ fontSize: 30 }}>{I18n.t('placeholder.newGroup')}</Text>
        <View style={{ paddingTop: 15 }}>
          <TextInput
            style={{ backgroundColor: '#FFF' }}
            label={I18n.t('placeholder.name')}
            value={this.state.groupName}
            onChangeText={groupName => this.setState({ groupName: groupName })}
          />
        </View>

        <View style={{ paddingTop: 20 }}>
          <Text style={{ fontSize: 30 }}>{I18n.t('placeholder.chooseService')}</Text>
          <View style={{ flex: 1 }}>
            <Dropdown
              label={<Text style={{ color: '#6d6b6b' }}>{I18n.t('placeholder.service')}</Text>}
              labelFontSize={Platform.isPad ? 22 : 12}
              fontSize={Platform.isPad ? 25 : 16}
              data={this.state.services}
              baseColor='#2d2c2c'
              selectedItemColor='#222'
              dropdownPosition={4}
              value={this.state.service}
              onChangeText={service => this.setState({ service: service })}
            />
          </View>
        </View>

        <View style={{ paddingTop: 35 }}>
          <AnimateLoadingButton
            ref={c => (this.loadingCreateGroup = c)}
            width={width - 25}
            height={50}
            title={I18n.t('button.save')}
            titleFontSize={18}
            titleColor='#FFF'
            backgroundColor='#03C8A1'
            borderRadius={25}
            onPress={this.clickCreateGroup.bind(this)}
          />
        </View>
      </View>
    );
  }
};
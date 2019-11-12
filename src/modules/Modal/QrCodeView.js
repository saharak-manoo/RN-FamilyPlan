import React, {Component} from 'react';
import {Linking, StatusBar, View} from 'react-native';
import {Appbar, Text, TextInput} from 'react-native-paper';
import I18n from '../../components/i18n';
import {Icon} from 'react-native-elements';
import * as Api from '../../util/Api';
import * as GFunction from '../../util/GlobalFunction';

export default class QrCodeView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View style={{padding: 30}}>
        <Text style={{fontSize: 30}}>{I18n.t('placeholder.qrCode')}</Text>
        <View style={{paddingTop: 15}}></View>
      </View>
    );
  }
}

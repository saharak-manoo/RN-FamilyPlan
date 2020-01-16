import React, {Component} from 'react';
import {Linking, StatusBar, View} from 'react-native';
import {Appbar, Text, TextInput} from 'react-native-paper';
import I18n from '../../components/i18n';

export default class QrCodeView extends Component {
  constructor(props) {
    super(props);
    this.state = {isDarkMode: this.props.isDarkMode};
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          height: 200,
          padding: 30,
          backgroundColor: this.state.isDarkMode ? '#363636' : '#FFF',
          borderRadius: 10,
        }}>
        <Text style={{fontSize: 30, fontFamily: 'Kanit-Light'}}>
          {I18n.t('placeholder.qrCode')}
        </Text>
        <View style={{paddingTop: 15}}></View>
      </View>
    );
  }
}

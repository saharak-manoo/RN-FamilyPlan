/* eslint-disable prettier/prettier */
import React, {Component} from 'react';
import {Dimensions, Platform, StatusBar, View, Linking} from 'react-native';
import {Appbar, Text, TextInput, HelperText} from 'react-native-paper';
import I18n from '../../components/i18n';
import {Dropdown} from 'react-native-material-dropdown';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import {Icon} from 'react-native-elements';
import * as Api from '../actions/api';
import * as GFun from '../../helpers/globalFunction';
import {ListItem} from 'react-native-elements';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import TouchableScale from 'react-native-touchable-scale';
import UserAvatar from 'react-native-user-avatar';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class ScbQRCodePaymentView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDarkMode: this.props.isDarkMode,
      group: this.props.group,
      isPaymentSuccess: false,
    };
  }

  async componentWillMount() {
    let user = await GFun.user();
    let response = await Api.createSCBQRCodePayment(
      user.authentication_jwt,
      this.state.group.id,
      parseFloat(
        this.state.group.service_charge / this.state.group.members.length,
      ).toFixed(2),
    );

    if (response.success) {
      console.log('response', response);
    } else {
      let errors = [];
      response.error.map((error, i) => {
        errors.splice(i, 0, I18n.t(`message.${GFun.camelize(error)}`));
      });
      GFun.errorMessage(I18n.t('message.notValidate'), errors.join('\n'));
    }
  }

  async closeModal() {
    this.loadingCloseScbQRCodePayment.showLoading(true);
    this.props.modal.current.close();
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          padding: 30,
          backgroundColor: this.state.isDarkMode ? '#363636' : '#FFF',
          borderTopLeftRadius: 10,
          borderTopRightRadius: 10,
        }}>
        <Text style={{fontSize: 30, fontFamily: 'Kanit-Light'}}>
          {I18n.t('placeholder.qrcodePayment')}
        </Text>
        <View style={{paddingTop: GFun.hp(2)}}></View>

        <View style={{paddingTop: 35}}>
          <AnimateLoadingButton
            ref={c => (this.loadingCloseScbQRCodePayment = c)}
            width={width - 25}
            height={50}
            title={I18n.t('button.close')}
            titleFontFamily={'Kanit-Light'}
            titleFontSize={18}
            titleColor="#FFF"
            backgroundColor="#F2001A"
            borderRadius={25}
            onPress={this.closeModal.bind(this)}
          />
        </View>
      </View>
    );
  }
}

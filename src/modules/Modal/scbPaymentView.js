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

export default class ScbPaymentView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDarkMode: this.props.isDarkMode,
      group: this.props.group,
      qrCodeImg: null,
      isPaymentSuccess: false,
    };
  }

  async scbPayment() {
    this.loadingScbPayment.showLoading(true);
    let user = await GFun.user();
    let response = await Api.createSCBPayment(
      user.authentication_jwt,
      this.state.group.id,
      parseFloat(
        this.state.group.service_charge / this.state.group.members.length,
      ).toFixed(2),
    );

    if (response.success) {
      this.loadingScbPayment.showLoading(false);
      let scbLink = response.scb_deep_link;
      Linking.openURL(scbLink).catch(e => {
        this.props.onNoAppSCBEasy();
        GFun.errorMessage(
          I18n.t('message.error'),
          I18n.t('message.requiresApp', {name: 'SCB Easy'}),
        );
      });
      this.props.modal.current.close();
    } else {
      this.loadingScbPayment.showLoading(false);
      let errors = [];
      response.error.map((error, i) => {
        errors.splice(i, 0, I18n.t(`message.${GFun.camelize(error)}`));
      });
      GFun.errorMessage(I18n.t('message.notValidate'), errors.join('\n'));
    }
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
          {I18n.t('placeholder.payment')}
        </Text>
        <View style={{paddingTop: GFun.hp(2)}}>
          {!this.state.isPaymentSuccess ? (
            <ListItem
              ref={c => (this.loadingScbPayment = c)}
              onPress={this.scbPayment.bind(this)}
              Component={TouchableScale}
              friction={90}
              tension={100}
              activeScale={0.85}
              leftAvatar={() => (
                <UserAvatar size="40" name={this.state.group.name} />
              )}
              title={I18n.t('message.totalPayment', {
                price: parseFloat(
                  this.state.group.service_charge /
                    this.state.group.members.length,
                ).toFixed(2),
              })}
              titleStyle={{
                fontFamily: 'Kanit-Light',
                color: this.state.isDarkMode ? '#FFF' : '#000',
              }}
              subtitle={I18n.t('message.paymentToGroup', {
                name: this.state.group.name,
              })}
              subtitleStyle={{
                fontFamily: 'Kanit-Light',
                color: this.state.isDarkMode ? '#FFF' : '#000',
              }}
              containerStyle={{
                backgroundColor: this.state.isDarkMode ? '#202020' : '#EEEEEE',
                borderRadius: 20,
                fontFamily: 'Kanit-Light',
              }}
              chevron={
                <MatIcon
                  name="payment"
                  size={35}
                  style={{
                    color: '#3F4DFC',
                  }}
                />
              }
            />
          ) : null}
        </View>

        <View style={{paddingTop: 35}}>
          <AnimateLoadingButton
            ref={c => (this.loadingScbPayment = c)}
            width={width - 25}
            height={50}
            title={I18n.t('button.payWithSCBEasy')}
            titleFontFamily={'Kanit-Light'}
            titleFontSize={18}
            titleColor="#FFF"
            backgroundColor="#3F4DFC"
            borderRadius={25}
            onPress={this.scbPayment.bind(this)}
          />
        </View>
      </View>
    );
  }
}

import React, {Component} from 'react';
import {Dimensions, Platform, StatusBar, View} from 'react-native';
import {
  Appbar,
  Text,
  TextInput,
  HelperText,
} from 'react-native-paper';
import I18n from '../../components/i18n';
import {Dropdown} from 'react-native-material-dropdown';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import {Icon} from 'react-native-elements';
import * as Api from '../actions/api';
import * as GFun from '../../helpers/globalFunction';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class SettingServiceChargeView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDarkMode: this.props.isDarkMode,
      serviceCharge: this.props.group.service_charge.toString(),
    };
  }

  async clickSettingServiceCharge() {
    this.loadingSettingServiceCharge.showLoading(true);
    let user = await GFun.user();
    let params = {
      service_charge: this.state.serviceCharge,
    };

    let response = await Api.updateGroup(
      user.authentication_jwt,
      this.props.group.id,
      params,
    );

    if (response.success) {
      this.loadingSettingServiceCharge.showLoading(false);
      GFun.successMessage(
        I18n.t('message.success'),
        I18n.t('message.settingServiceChargeSuccessful'),
      );
      this.props.modal.current.close();
      this.props.group.service_charge = parseFloat(this.state.serviceCharge);
      this.props.onSetNewData(this.props.group);
    } else {
      this.loadingSettingServiceCharge.showLoading(false);
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
          {I18n.t('placeholder.settingServiceCharge')}
        </Text>
        <View style={{paddingTop: GFun.hp(2)}}>
          <TextInput
            keyboardAppearance={this.state.isDarkMode ? 'dark' : 'light'}
            style={{
              paddingBottom: 6,
              fontFamily: 'Kanit-Light',
              height: 50,
              textAlign: 'center',
              backgroundColor: this.state.isDarkMode ? '#363636' : '#EEEEEE',
            }}
            mode="outlined"
            keyboardType="numeric"
            placeholder={I18n.t('placeholder.serviceCharge')}
            value={this.state.serviceCharge}
            onChangeText={serviceCharge =>
              this.setState({
                serviceCharge: serviceCharge.replace(/[^0-9]/g, ''),
              })
            }
          />
          <HelperText
            style={{fontFamily: 'Kanit-Light', color: '#FF3260'}}
            type="error"
            visible={GFun.validateBlank(this.state.serviceCharge)}>
            {I18n.t('message.valueCannotBeBlank')}
          </HelperText>
        </View>

        <View style={{paddingTop: 35}}>
          <AnimateLoadingButton
            ref={c => (this.loadingSettingServiceCharge = c)}
            width={width - 25}
            height={50}
            titleFontFamily={'Kanit-Light'}
            title={I18n.t('button.submit')}
            titleFontSize={18}
            titleColor="#FFF"
            backgroundColor="#03C8A1"
            borderRadius={25}
            onPress={this.clickSettingServiceCharge.bind(this)}
          />
        </View>
      </View>
    );
  }
}

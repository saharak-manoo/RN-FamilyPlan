import React, {Component} from 'react';
import {Dimensions, Platform, StatusBar, View} from 'react-native';
import {Appbar, Text, TextInput, HelperText} from 'react-native-paper';
import I18n from '../../components/i18n';
import {Dropdown} from 'react-native-material-dropdown';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import {Icon} from 'react-native-elements';
import * as Api from '../../util/Api';
import * as GFunction from '../../util/GlobalFunction';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class SettingServiceChargeView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      serviceCharge: this.props.group.service_charge.toString(),
    };
  }

  clickSettingServiceCharge() {
    this.loadingSettingServiceCharge.showLoading(true);
    setTimeout(() => {
      if (this.props.modal.current) {
        this.loadingSettingServiceCharge.showLoading(false);
        GFunction.successMessage(
          I18n.t('message.success'),
          I18n.t('message.settingServiceChargeSuccessful'),
        );
        this.props.modal.current.close();
        this.props.group.service_charge = this.state.serviceCharge;
        this.props.onSetNewData(this.props.group);
      }
    }, 1000);
  }

  render() {
    return (
      <View style={{flex: 1, padding: 30}}>
        <Text style={{fontSize: 30}}>
          {I18n.t('placeholder.settingServiceCharge')}
        </Text>
        <View style={{paddingTop: 15}}>
          <TextInput
            style={{backgroundColor: '#FFF'}}
            keyboardType="numeric"
            label={I18n.t('placeholder.serviceCharge')}
            value={this.state.serviceCharge}
            onChangeText={serviceCharge =>
              this.setState({
                serviceCharge: serviceCharge.replace(/[^0-9]/g, ''),
              })
            }
          />
          <HelperText
            type="error"
            visible={GFunction.validateBlank(this.state.serviceCharge)}>
            {I18n.t('message.valueCannotBeBlank')}
          </HelperText>
        </View>

        <View style={{paddingTop: 35}}>
          <AnimateLoadingButton
            ref={c => (this.loadingSettingServiceCharge = c)}
            width={width - 25}
            height={50}
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

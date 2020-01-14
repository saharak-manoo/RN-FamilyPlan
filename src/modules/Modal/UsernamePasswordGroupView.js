import React, {Component} from 'react';
import {Dimensions, Clipboard, StatusBar, View} from 'react-native';
import {Appbar, Text, TextInput, HelperText} from 'react-native-paper';
import I18n from '../../components/i18n';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import * as Api from '../../util/Api';
import * as GFun from '../../util/GlobalFunction';
import {Icon} from 'react-native-elements';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class UsernamePasswordGroupView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      isDarkMode: this.props.isDarkMode,
      isGroupLeader: !this.props.isGroupLeader || false,
      userName: this.props.userName || '',
      password: this.props.password || '',
    };
  }

  async clickSettingUsernamePassword() {
    this.loadingSettingUsernamePassword.showLoading(true);
    let user = await GFun.user();
    let params = {
      user_name: this.state.userName,
      password: this.state.password,
    };

    let response = await Api.updateGroup(
      user.authentication_jwt,
      this.props.group.id,
      params,
    );

    if (response.success) {
      this.loadingSettingUsernamePassword.showLoading(false);
      GFun.successMessage(
        I18n.t('message.success'),
        I18n.t('message.settingUsernamePasswordSuccessful'),
      );
      this.props.modal.current.close();
    } else {
      this.loadingSettingUsernamePassword.showLoading(false);
      let errors = [];
      response.error.map((error, i) => {
        errors.splice(i, 0, I18n.t(`message.${GFun.camelize(error)}`));
      });
      GFun.errorMessage(I18n.t('message.notValidate'), errors.join('\n'));
    }
  }

  async clickCloseUsernamePassword() {
    this.loadingCloseUsernamePassword.showLoading(true);
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
          {I18n.t('placeholder.usernameAndPassword')}
        </Text>
        <View style={{paddingTop: GFun.hp(2), flexDirection: 'row'}}>
          <View style={{flex: 0.8}}>
            <TextInput
              disabled={!this.state.isGroupLeader}
              keyboardAppearance={this.state.isDarkMode ? 'dark' : 'light'}
              style={{
                paddingBottom: 6,
                fontFamily: 'Kanit-Light',
                height: 50,
                textAlign: 'center',
                backgroundColor: this.state.isDarkMode ? '#363636' : '#EEEEEE',
              }}
              mode="outlined"
              placeholder={I18n.t('placeholder.username')}
              value={this.state.userName}
              onChangeText={userName =>
                this.setState({
                  userName: userName,
                })
              }
            />
            <HelperText
              style={{fontFamily: 'Kanit-Light', color: '#FF3260'}}
              type="error"
              visible={GFun.validateBlank(this.state.userName)}>
              {I18n.t('message.valueCannotBeBlank')}
            </HelperText>
          </View>
          <View
            style={{
              flex: 0.2,
              paddingLeft: GFun.hp(2),
              paddingTop: GFun.hp(0.5),
            }}>
            <Icon
              size={GFun.hp(2)}
              reverse
              name="copy"
              type="font-awesome"
              color="#006CED"
              onPress={() => {
                Clipboard.setString(this.state.userName);
                GFun.successMessage(
                  I18n.t('message.success'),
                  I18n.t('message.copyUserNameSuccessful'),
                );
              }}
            />
          </View>
        </View>

        <View style={{paddingTop: GFun.hp(1), flexDirection: 'row'}}>
          <View style={{flex: 0.8}}>
            <TextInput
              disabled={!this.state.isGroupLeader}
              secureTextEntry
              keyboardAppearance={this.state.isDarkMode ? 'dark' : 'light'}
              style={{
                paddingBottom: 6,
                fontFamily: 'Kanit-Light',
                height: 50,
                textAlign: 'center',
                backgroundColor: this.state.isDarkMode ? '#363636' : '#EEEEEE',
              }}
              mode="outlined"
              placeholder={I18n.t('placeholder.password')}
              value={this.state.password}
              onChangeText={password =>
                this.setState({
                  password: password,
                })
              }
            />
            <HelperText
              style={{fontFamily: 'Kanit-Light', color: '#FF3260'}}
              type="error"
              visible={GFun.validateBlank(this.state.password)}>
              {I18n.t('message.valueCannotBeBlank')}
            </HelperText>
          </View>
          <View
            style={{
              flex: 0.2,
              paddingLeft: GFun.hp(2),
              paddingTop: GFun.hp(0.5),
            }}>
            <Icon
              size={GFun.hp(2)}
              reverse
              name="copy"
              type="font-awesome"
              color="#DD7200"
              onPress={() => {
                Clipboard.setString(this.state.password);
                GFun.successMessage(
                  I18n.t('message.success'),
                  I18n.t('message.copyPasswordSuccessful'),
                );
              }}
            />
          </View>
        </View>

        <View style={{paddingTop: 35}}>
          {this.state.isGroupLeader ? (
            <AnimateLoadingButton
              ref={c => (this.loadingSettingUsernamePassword = c)}
              width={width - 25}
              height={50}
              titleFontFamily={'Kanit-Light'}
              title={I18n.t('button.submit')}
              titleFontSize={18}
              titleColor="#FFF"
              backgroundColor="#03C8A1"
              borderRadius={25}
              onPress={this.clickSettingUsernamePassword.bind(this)}
            />
          ) : (
            <AnimateLoadingButton
              ref={c => (this.loadingCloseUsernamePassword = c)}
              width={width - 25}
              height={50}
              titleFontFamily={'Kanit-Light'}
              title={I18n.t('button.close')}
              titleFontSize={18}
              titleColor="#FFF"
              backgroundColor="#F2001A"
              borderRadius={25}
              onPress={this.clickCloseUsernamePassword.bind(this)}
            />
          )}
        </View>
      </View>
    );
  }
}

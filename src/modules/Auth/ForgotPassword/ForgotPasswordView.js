import React, {Component} from 'react';
import {
  Alert,
  View,
  Platform,
  Dimensions,
  Modal,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {connect} from 'react-redux';
import {setScreenBadgeNow, setDarkMode, setLanguage} from '../../actions';
import {Appbar, Text, HelperText, TextInput} from 'react-native-paper';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import I18n from '../../../components/i18n';
import * as Api from '../../actions/api';
import * as GFun from '../../../helpers/globalFunction';
import {styles} from '../../../components/styles';
import ActionButton from 'react-native-action-button';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import Modalize from 'react-native-modalize';

// View
import AppSettingView from '../../modal/appSettingView';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const IS_IOS = Platform.OS === 'ios';

class ForgotPasswordView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDarkMode: props.setting.isDarkMode,
      email: '',
    };
  }

  appSettingModal = React.createRef();

  appHerder() {
    return (
      <View>
        <Appbar.Header style={{backgroundColor: this.props.setting.appColor}}>
          <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content
            title={I18n.t('placeholder.appName')}
            titleStyle={{fontFamily: 'Kanit-Light'}}
          />
        </Appbar.Header>
      </View>
    );
  }

  clickResetPassword() {
    this.loadingResetPassword.showLoading(true);
    this.forgotPassword();
  }

  async forgotPassword() {
    let params = {
      email: this.state.email,
    };

    let response = await Api.forgotPassword(params);
    if (response.success) {
      this.loadingResetPassword.showLoading(false);
      GFun.successMessage(
        I18n.t('message.success'),
        I18n.t('message.resetPassword'),
      );
      this.props.navigation.navigate('Login');
    } else {
      this.loadingResetPassword.showLoading(false);
      GFun.errorMessage(
        I18n.t('message.notValidate'),
        I18n.t('message.' + response.messages),
      );
    }
  }

  showAppSettingModal = () => {
    if (this.appSettingModal.current) {
      this.appSettingModal.current.open();
    }
  };

  popUpModalAppSetting() {
    return (
      <Modalize
        ref={this.appSettingModal}
        modalStyle={styles.popUpModal}
        overlayStyle={styles.overlayModal}
        handleStyle={styles.handleModal}
        modalHeight={height / 1.08}
        handlePosition="inside"
        openAnimationConfig={{
          timing: {duration: 400},
          spring: {speed: 10, bounciness: 10},
        }}
        closeAnimationConfig={{
          timing: {duration: 400},
          spring: {speed: 10, bounciness: 10},
        }}
        withReactModal
        adjustToContentHeight>
        <AppSettingView modal={this.newGroupModal} />
      </Modalize>
    );
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: this.state.isDarkMode ? '#202020' : '#EEEEEE',
        }}>
        {this.appHerder()}
        <View style={{padding: GFun.hp(2), alignContent: 'center'}}>
          <Text
            style={{
              alignSelf: 'center',
              fontSize: GFun.hp(5),
              fontFamily: 'Kanit-Light',
            }}>
            {I18n.t('message.forgotPassword')}
          </Text>
        </View>
        <View style={{padding: GFun.hp(2)}}>
          <TextInput
            keyboardAppearance={this.state.isDarkMode ? 'dark' : 'light'}
            style={{
              paddingBottom: GFun.hp(1),
              fontFamily: 'Kanit-Light',
              height: 50,
              backgroundColor: this.state.isDarkMode ? '#363636' : '#EEEEEE',
            }}
            placeholder={I18n.t('placeholder.email')}
            mode="outlined"
            value={this.state.email}
            onChangeText={email => this.setState({email: email})}
          />
          <HelperText
            style={{fontFamily: 'Kanit-Light', color: '#FF3260'}}
            type="error"
            visible={GFun.validateEmail(this.state.email)}>
            {I18n.t('message.emailIsInvalid')}
          </HelperText>

          <View style={{justifyContent: 'center', paddingTop: 10}}>
            <AnimateLoadingButton
              ref={load => (this.loadingResetPassword = load)}
              fontFamily={'Kanit-Light'}
              width={width - 25}
              height={50}
              title={I18n.t('button.resetPassword')}
              titleFontSize={18}
              titleColor="#FFF"
              backgroundColor="#1C83F7"
              borderRadius={25}
              onPress={this.clickResetPassword.bind(this)}
            />
          </View>
        </View>

        <ActionButton
          buttonColor={'#202020'}
          icon={<FAIcon name="cog" style={styles.actionButtonIcon} />}
          onPress={this.showAppSettingModal}
        />
        {this.popUpModalAppSetting()}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  screenBadge: state.screenBadge,
  setting: state.setting,
});

const mapDispatchToProps = {
  setScreenBadgeNow,
  setDarkMode,
  setLanguage,
};

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPasswordView);

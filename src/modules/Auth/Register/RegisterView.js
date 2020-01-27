import React, {Component} from 'react';
import {
  Alert,
  View,
  Dimensions,
  Platform,
  TouchableOpacity,
  Modal,
  ScrollView,
  StatusBar,
} from 'react-native';
import {connect} from 'react-redux';
import {setScreenBadgeNow, setDarkMode, setLanguage} from '../../actions';
import {Appbar, Text, HelperText, TextInput} from 'react-native-paper';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import I18n from '../../../components/i18n';
import {Dropdown} from 'react-native-material-dropdown';
import * as Api from '../../actions/api';
import * as GFun from '../../../helpers/globalFunction';
import AsyncStorage from '@react-native-community/async-storage';
import ActionButton from 'react-native-action-button';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import Modalize from 'react-native-modalize';
import {styles} from '../../../components/styles';

// View
import AppSettingView from '../../modal/appSettingView';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const IS_IOS = Platform.OS === 'ios';

class RegisterView extends Component {
  constructor(props) {
    super(props);
    let params = this.props.navigation.state.params;
    this.state = {
      isDarkMode: props.setting.isDarkMode,
      prefixs: [
        {
          value: I18n.t('text.mr'),
          en: 'mr',
        },
        {
          value: I18n.t('text.mrs'),
          en: 'mrs',
        },
        {
          value: I18n.t('text.miss'),
          en: 'miss',
        },
      ],
      prefix: 'Mr',
      firstName: params ? params.firstName : null,
      lastName: params ? params.lastName : null,
      email: params ? params.email : null,
      appleIdUid: params ? params.appleIdUid : null,
      facebookIdUid: params ? params.facebookIdUid : null,
      lineIdUid: params ? params.lineIdUid : null,
      googleIdUid: params ? params.googleIdUid : null,
      authProfileUrl: params ? params.authProfileUrl : null,
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    };
  }

  appSettingModal = React.createRef();

  componentDidMount = async () => {
    this.setState({spinner: true});
    let locale = await AsyncStorage.getItem('locale');
    this.setState({prefix: locale === 'th' ? 'นาย' : 'Mr'});
  };

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

  validate() {
    if (this.state.password && this.state.confirmPassword) {
      if (this.state.password.length < 6 || this.state.confirmPassword < 6) {
        GFun.errorMessage(
          I18n.t('message.notValidate'),
          I18n.t('message.passwordLessThanSix'),
        );
        this.loadingSignUp.showLoading(false);
      } else {
        if (this.state.password !== this.state.confirmPassword) {
          GFun.errorMessage(
            I18n.t('message.notValidate'),
            I18n.t('message.passwordNotMatch'),
          );
          this.loadingSignUp.showLoading(false);
        } else {
          this.saveUser();
        }
      }
    } else {
      GFun.errorMessage(
        I18n.t('message.notValidate'),
        I18n.t('message.pleaseInputAllValue'),
      );
      this.loadingSignUp.showLoading(false);
    }
  }

  clickSignUp() {
    this.loadingSignUp.showLoading(true);
    this.validate();
  }

  async saveUser() {
    let titleSelected = this.state.prefixs.filter(
      f => f.value === this.state.prefix,
    )[0].en;
    let params = {
      prefix: titleSelected,
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      email: this.state.email,
      phone_number: this.state.phoneNumber,
      password: this.state.password,
      confirm_password: this.state.confirmPassword,
      sign_in_with: this.state.signInWith,
      apple_id_uid: this.state.appleIdUid,
      facebook_id_uid: this.state.facebookIdUid,
      line_id_uid: this.state.lineIdUid,
      google_id_uid: this.state.googleIdUid,
      auth_profile_url: this.state.authProfileUrl,
    };

    let response = await Api.signUp(params);

    if (response.success) {
      this.loadingSignUp.showLoading(false);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      GFun.successMessage(
        I18n.t('message.success'),
        I18n.t('message.signUpSuccessful'),
      );
      this.props.navigation.navigate('Home', {
        isDarkMode: this.state.isDarkMode,
      });
    } else {
      this.loadingSignUp.showLoading(false);
      let errors = [];
      response.errors.map((error, i) => {
        errors.splice(i, 0, I18n.t(`message.${GFun.camelize(error)}`));
      });
      GFun.errorMessage(I18n.t('message.notValidate'), errors.join('\n'));
    }
  }

  goToSignIn() {
    this.loadingGoToSignIn.showLoading(true);
    setTimeout(() => {
      this.loadingGoToSignIn.showLoading(false);
      this.props.navigation.navigate('Login', {
        isDarkMode: this.state.isDarkMode,
      });
    }, 300);
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
        <AppSettingView modal={this.appSettingModal} />
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
        <ScrollView style={{flex: 1}}>
          <View style={{padding: GFun.hp(2), alignSelf: 'center'}}>
            <Text
              style={{
                alignSelf: 'center',
                fontSize: GFun.hp(6),
                fontFamily: 'Kanit-Light',
              }}>
              {I18n.t('button.signUp')}
            </Text>
          </View>
          <View style={{padding: GFun.hp(2)}}>
            <TextInput
              keyboardAppearance={this.state.isDarkMode ? 'dark' : 'light'}
              style={{
                paddingBottom: GFun.hp(1),
                fontFamily: 'Kanit-Light',
                height: 50,
                textAlign: 'center',
                backgroundColor: this.state.isDarkMode ? '#363636' : '#EEEEEE',
              }}
              placeholder={I18n.t('placeholder.firstName')}
              mode="outlined"
              value={this.state.firstName}
              onChangeText={firstName => this.setState({firstName: firstName})}
            />
            <HelperText
              style={{fontFamily: 'Kanit-Light', color: '#FF3260'}}
              type="error"
              visible={GFun.validateBlank(this.state.firstName)}>
              {I18n.t('message.firstNameCannotBeBlank')}
            </HelperText>

            <TextInput
              keyboardAppearance={this.state.isDarkMode ? 'dark' : 'light'}
              style={{
                paddingBottom: GFun.hp(1),
                fontFamily: 'Kanit-Light',
                height: 50,
                textAlign: 'center',
                backgroundColor: this.state.isDarkMode ? '#363636' : '#EEEEEE',
              }}
              placeholder={I18n.t('placeholder.lastName')}
              mode="outlined"
              value={this.state.lastName}
              onChangeText={lastName => this.setState({lastName: lastName})}
            />
            <HelperText
              style={{fontFamily: 'Kanit-Light', color: '#FF3260'}}
              type="error"
              visible={GFun.validateBlank(this.state.lastName)}>
              {I18n.t('message.lastNameCannotBeBlank')}
            </HelperText>

            <TextInput
              keyboardAppearance={this.state.isDarkMode ? 'dark' : 'light'}
              style={{
                paddingBottom: GFun.hp(1),
                fontFamily: 'Kanit-Light',
                height: 50,
                textAlign: 'center',
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

            <TextInput
              keyboardType="numeric"
              maxLength={10}
              keyboardAppearance={this.state.isDarkMode ? 'dark' : 'light'}
              style={{
                paddingBottom: GFun.hp(1),
                fontFamily: 'Kanit-Light',
                height: 50,
                textAlign: 'center',
                backgroundColor: this.state.isDarkMode ? '#363636' : '#EEEEEE',
              }}
              placeholder={I18n.t('placeholder.phoneNumber')}
              mode="outlined"
              value={this.state.phoneNumber}
              onChangeText={phoneNumber =>
                this.setState({phoneNumber: phoneNumber.replace(/[^0-9]/g, '')})
              }
            />
            <HelperText
              style={{fontFamily: 'Kanit-Light', color: '#FF3260'}}
              type="error"
              visible={GFun.validatePhoneNumber(this.state.phoneNumber)}>
              {I18n.t('message.telephoneMustBeTen')}
            </HelperText>

            <TextInput
              secureTextEntry
              autoCorrect={false}
              keyboardAppearance={this.state.isDarkMode ? 'dark' : 'light'}
              style={{
                paddingBottom: GFun.hp(1),
                fontFamily: 'Kanit-Light',
                height: 50,
                textAlign: 'center',
                backgroundColor: this.state.isDarkMode ? '#363636' : '#EEEEEE',
              }}
              placeholder={I18n.t('placeholder.password')}
              mode="outlined"
              value={this.state.password}
              onChangeText={password => this.setState({password: password})}
            />
            <HelperText
              style={{fontFamily: 'Kanit-Light', color: '#FF3260'}}
              type="error"
              visible={GFun.validatePasswordLessThanSix(this.state.password)}>
              {I18n.t('message.passwordLessThanSix')}
            </HelperText>

            <TextInput
              secureTextEntry
              autoCorrect={false}
              keyboardAppearance={this.state.isDarkMode ? 'dark' : 'light'}
              style={{
                paddingBottom: GFun.hp(1),
                fontFamily: 'Kanit-Light',
                height: 50,
                textAlign: 'center',
                backgroundColor: this.state.isDarkMode ? '#363636' : '#EEEEEE',
              }}
              placeholder={I18n.t('placeholder.confirmPassword')}
              mode="outlined"
              value={this.state.confirmPassword}
              onChangeText={confirmPassword =>
                this.setState({confirmPassword: confirmPassword})
              }
            />
            <HelperText
              style={{fontFamily: 'Kanit-Light', color: '#FF3260'}}
              type="error"
              visible={GFun.validatePasswordMatch(
                this.state.password,
                this.state.confirmPassword,
              )}>
              {I18n.t('message.passwordNotMatch')}
            </HelperText>

            <View style={{justifyContent: 'center', paddingTop: GFun.hp(1)}}>
              <AnimateLoadingButton
                ref={load => (this.loadingSignUp = load)}
                titleFontFamily={'Kanit-Light'}
                width={width - 25}
                height={50}
                title={I18n.t('button.signUp')}
                titleFontSize={18}
                titleColor="#FFF"
                backgroundColor="#1C83F6"
                borderRadius={25}
                onPress={this.clickSignUp.bind(this)}
              />

              <TouchableOpacity
                style={{
                  padding: GFun.hp(2),
                  paddingTop: GFun.hp(2),
                  alignItems: 'center',
                }}
                onPress={() =>
                  this.props.navigation.navigate('ForgotPassword', {
                    isDarkMode: this.state.isDarkMode,
                  })
                }>
                <Text
                  style={{
                    color: this.state.isDarkMode ? '#FFF' : '#000',
                    fontSize: 15,
                    textDecorationLine: 'underline',
                    fontFamily: 'Kanit-Light',
                  }}>
                  {I18n.t('button.forgotPassword')}
                </Text>
              </TouchableOpacity>

              <AnimateLoadingButton
                ref={c => (this.loadingGoToSignIn = c)}
                titleFontFamily={'Kanit-Light'}
                width={width - 25}
                height={50}
                title={I18n.t('button.signIn')}
                titleFontSize={18}
                titleColor="#FFF"
                backgroundColor="#F61C58"
                borderRadius={25}
                onPress={this.goToSignIn.bind(this)}
              />
            </View>
          </View>
        </ScrollView>

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

export default connect(mapStateToProps, mapDispatchToProps)(RegisterView);

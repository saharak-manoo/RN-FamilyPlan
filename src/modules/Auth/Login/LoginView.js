import React, {Component} from 'react';
import {
  Alert,
  View,
  Platform,
  Dimensions,
  TouchableOpacity,
  Modal,
  Image,
  StatusBar,
  ScrollView,
} from 'react-native';
import {connect} from 'react-redux';
import {setScreenBadgeNow, setDarkMode, setLanguage} from '../../actions';
import {Appbar, Text, HelperText, TextInput} from 'react-native-paper';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import I18n from '../../../components/i18n';
import * as Api from '../../actions/api';
import * as GFun from '../../../helpers/globalFunction';
import AsyncStorage from '@react-native-community/async-storage';
import appleAuth, {
  AppleButton,
  AppleAuthRequestScope,
  AppleAuthRequestOperation,
  AppleAuthCredentialState,
  AppleAuthError,
} from '@invertase/react-native-apple-authentication';
import FBSDK, {
  LoginManager,
  LoginButton,
  AccessToken,
  GraphRequest,
  GraphRequestManager,
} from 'react-native-fbsdk';
import LineLogin from 'react-native-line-sdk';
import {styles} from '../../../components/styles';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const IS_IOS = Platform.OS === 'ios';

class LoginView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDarkMode: props.setting.isDarkMode,
      email: '',
      password: '',
    };
  }

  async componentDidMount() {
    this.props.setScreenBadgeNow(0, 0);
  }

  appHerder() {
    return (
      <View>
        <Appbar.Header style={{backgroundColor: this.props.setting.appColor}}>
          <Appbar.Content
            title={I18n.t('placeholder.appName')}
            titleStyle={{fontFamily: 'Kanit-Light'}}
          />
        </Appbar.Header>
      </View>
    );
  }

  clickSignIn() {
    this.loadingLogin.showLoading(true);
    this.signIn();
  }

  async signIn() {
    let params = {
      email: this.state.email,
      password: this.state.password,
    };

    let response = await Api.signIn(params);
    if (response.success) {
      this.loadingLogin.showLoading(false);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      GFun.successMessage(
        I18n.t('message.success'),
        I18n.t('message.signInSuccessful'),
      );
      this.props.navigation.navigate('Home', {
        isDarkMode: this.state.isDarkMode,
      });
    } else {
      this.loadingLogin.showLoading(false);
      GFun.errorMessage(
        I18n.t('message.notValidate'),
        I18n.t('message.EmailOrPasswordMismatch'),
      );
    }
  }

  goToSignUp() {
    this.loadingGoToSignUp.showLoading(true);
    setTimeout(() => {
      this.loadingGoToSignUp.showLoading(false);
      this.props.navigation.navigate('Register', {
        isDarkMode: this.state.isDarkMode,
      });
    }, 500);
  }

  signInWithAppleId = async () => {
    let resp = await appleAuth.performRequest({
      requestedOperation: AppleAuthRequestOperation.LOGIN,
      requestedScopes: [
        AppleAuthRequestScope.EMAIL,
        AppleAuthRequestScope.FULL_NAME,
      ],
    });

    let user = {
      email: resp.email,
      first_name: resp.fullName.givenName,
      last_name: resp.fullName.familyName,
      apple_id_uid: resp.user,
      sign_in_with: 'apple_id',
    };

    if (user.apple_id_uid == '' || user.apple_id_uid == null) {
      this.props.navigation.navigate('Register', {
        isDarkMode: this.state.isDarkMode,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        appleIdUid: user.apple_id_uid,
        signInWith: 'apple_id',
      });
    } else {
      let response = await Api.signInWith(user);
      if (response.success) {
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        GFun.successMessage(
          I18n.t('message.success'),
          I18n.t('message.signInSuccessful'),
        );
        this.props.navigation.navigate('Home', {
          isDarkMode: this.state.isDarkMode,
        });
      } else {
        this.props.navigation.navigate('Register', {
          isDarkMode: this.state.isDarkMode,
          firstName: user.first_name,
          lastName: user.last_name,
          email: user.email,
          appleIdUid: user.apple_id_uid,
          signInWith: 'apple_id',
        });
      }
    }
  };

  signInWithFacebook = async () => {
    LoginManager.logInWithPermissions(['public_profile', 'email']).then(
      resp => {
        if (!resp.isCancelled) {
          AccessToken.getCurrentAccessToken().then(user => {
            console.log('user', user);
            this.facebookSignIn(user.accessToken);
            return user;
          });
        }
      },
      error => {
        console.log('Facebook  error : ', error);
      },
    );
  };

  facebookSignIn = async accessToken => {
    const responseInfoCallback = async (error, resp) => {
      if (error) {
        console.log('error', error);
      } else if (resp) {
        console.log('resp', resp);
      }
    };

    const infoRequest = new GraphRequest(
      '/me',
      {
        accessToken: accessToken,
        parameters: {
          fields: {
            string: 'email, first_name, last_name, age_range, gender, picture',
          },
        },
      },
      responseInfoCallback,
    );
    new GraphRequestManager().addRequest(infoRequest).start();
  };

  signInWithLine = async () => {
    LineLogin.loginWithPermissions(['profile', 'openid', 'email'])
      .then(user => {
        console.log('Line user', user);
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: this.state.isDarkMode ? '#202020' : '#EEEEEE',
        }}>
        {this.appHerder()}
        <ScrollView>
          <View
            style={{
              justifyContent: 'center',
              paddingTop: GFun.hp(2),
              padding: GFun.hp(2),
            }}>
            {appleAuth.isSupported && (
              <View style={{justifyContent: 'center', paddingTop: 2}}>
                <TouchableOpacity
                  style={[
                    styles.buttonLoginWith,
                    {
                      marginTop: GFun.hp(2),
                      backgroundColor: '#000',
                      flexDirection: 'row',
                      borderRadius: 28,
                      height: 50,
                    },
                  ]}
                  onPress={this.signInWithAppleId}>
                  <View style={{flex: 0.1, paddingLeft: 10}}>
                    <FontAwesomeIcon
                      name="apple"
                      size={26}
                      color={'#FFF'}></FontAwesomeIcon>
                  </View>
                  <View style={{flex: 1, alignItems: 'center'}}>
                    <Text
                      style={{
                        color: '#FFF',
                        fontSize: 19,
                        fontFamily: 'Kanit-Light',
                      }}>
                      {`${I18n.t('button.signinWith')} Apple`}
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            )}

            <View style={{justifyContent: 'center', paddingTop: 2}}>
              <TouchableOpacity
                style={[
                  styles.buttonLoginWith,
                  {
                    marginTop: GFun.hp(2),
                    backgroundColor: '#4267be',
                    flexDirection: 'row',
                    borderRadius: 28,
                    height: 50,
                  },
                ]}
                onPress={this.signInWithFacebook}>
                <View style={{flex: 0.1, paddingLeft: 10}}>
                  <FontAwesomeIcon
                    name="facebook-square"
                    size={26}
                    color={'#FFF'}></FontAwesomeIcon>
                </View>
                <View style={{flex: 1, alignItems: 'center'}}>
                  <Text
                    style={{
                      color: '#FFF',
                      fontSize: 19,
                      fontFamily: 'Kanit-Light',
                    }}>
                    {`${I18n.t('button.signinWith')} Facebook`}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>

            <View style={{justifyContent: 'center', paddingTop: 2}}>
              <TouchableOpacity
                style={[
                  styles.buttonLoginWith,
                  {
                    marginTop: GFun.hp(2),
                    backgroundColor: '#18C464',
                    flexDirection: 'row',
                    borderRadius: 28,
                    height: 50,
                  },
                ]}
                onPress={this.signInWithLine}>
                <View style={{flex: 0.1, paddingLeft: 10}}>
                  <Image
                    source={require('../../../img/line.png')}
                    style={{width: 26, height: 26, marginRight: 20}}
                  />
                </View>
                <View style={{flex: 1, alignItems: 'center'}}>
                  <Text
                    style={{
                      color: '#FFF',
                      fontSize: 19,
                      fontFamily: 'Kanit-Light',
                    }}>
                    {`${I18n.t('button.signinWith')} LINE`}
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{padding: 15}}>
            <TextInput
              keyboardAppearance={this.state.isDarkMode ? 'dark' : 'light'}
              style={{
                paddingBottom: 6,
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

            <TextInput
              keyboardAppearance={this.state.isDarkMode ? 'dark' : 'light'}
              style={{
                paddingBottom: 6,
                fontFamily: 'Kanit-Light',
                height: 50,
                textAlign: 'center',
                backgroundColor: this.state.isDarkMode ? '#363636' : '#EEEEEE',
              }}
              secureTextEntry
              autoCorrect={false}
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

            <View style={{justifyContent: 'center', paddingTop: 10}}>
              <AnimateLoadingButton
                ref={load => (this.loadingLogin = load)}
                width={width - 25}
                height={50}
                title={I18n.t('button.signIn')}
                titleFontSize={18}
                titleFontFamily={'Kanit-Light'}
                titleColor={'#FFF'}
                backgroundColor="#1C83F7"
                borderRadius={25}
                onPress={this.clickSignIn.bind(this)}
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
                ref={c => (this.loadingGoToSignUp = c)}
                width={width - 25}
                height={50}
                title={I18n.t('button.signUp')}
                titleFontFamily={'Kanit-Light'}
                titleFontSize={18}
                titleColor={'#FFF'}
                backgroundColor="#F71C58"
                borderRadius={25}
                onPress={this.goToSignUp.bind(this)}
              />
            </View>
          </View>
        </ScrollView>
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

export default connect(mapStateToProps, mapDispatchToProps)(LoginView);

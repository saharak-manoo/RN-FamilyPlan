import React, {Component} from 'react';
import {
  Alert,
  View,
  Platform,
  Dimensions,
  TouchableOpacity,
  Modal,
  StatusBar,
} from 'react-native';
import {Appbar, Text, HelperText, TextInput} from 'react-native-paper';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import I18n from '../../../components/i18n';
import * as Api from '../../../util/Api';
import * as GFunction from '../../../util/GlobalFunction';
import AsyncStorage from '@react-native-community/async-storage';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const IS_IOS = Platform.OS === 'ios';
const BAR_COLOR = IS_IOS ? '#1C83F7' : '#000';

export default class LoginView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    };
  }

  componentDidMount = async () => {};

  appHerder() {
    return (
      <View>
        <StatusBar backgroundColor={BAR_COLOR} barStyle="light-content" />
        <Appbar.Header style={{backgroundColor: '#1C83F7'}}>
          <Appbar.Content title={I18n.t('placeholder.appName')} />
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
      GFunction.successMessage(
        I18n.t('message.success'),
        I18n.t('message.signInSuccessful'),
      );
      this.props.navigation.navigate('Home');
    } else {
      this.loadingLogin.showLoading(false);
      GFunction.errorMessage(
        I18n.t('message.notValidate'),
        I18n.t('message.EmailOrPasswordMismatch'),
      );
    }
  }

  goToSignUp() {
    this.loadingGoToSignUp.showLoading(true);
    setTimeout(() => {
      this.loadingGoToSignUp.showLoading(false);
      this.props.navigation.navigate('Register');
    }, 500);
  }

  render() {
    return (
      <View style={{flex: 1}}>
        {this.appHerder()}
        <View style={{padding: 45, alignSelf: 'center'}}>
          <Text style={{alignSelf: 'center', fontSize: 38}}>
            {I18n.t('button.signIn')}
          </Text>
        </View>
        <View style={{padding: 15}}>
          <TextInput
            style={{paddingBottom: 6}}
            label={I18n.t('placeholder.email')}
            mode="outlined"
            value={this.state.email}
            onChangeText={email => this.setState({email: email})}
          />
          <HelperText
            type="error"
            visible={GFunction.validateEmail(this.state.email)}>
            {I18n.t('message.emailIsInvalid')}
          </HelperText>

          <TextInput
            secureTextEntry
            autoCorrect={false}
            style={{paddingBottom: 6}}
            label={I18n.t('placeholder.password')}
            mode="outlined"
            value={this.state.password}
            onChangeText={password => this.setState({password: password})}
          />
          <HelperText
            type="error"
            visible={GFunction.validatePasswordLessThanSix(
              this.state.password,
            )}>
            {I18n.t('message.passwordLessThanSix')}
          </HelperText>

          <View style={{justifyContent: 'center', paddingTop: 10}}>
            <AnimateLoadingButton
              ref={load => (this.loadingLogin = load)}
              width={width - 25}
              height={50}
              title={I18n.t('button.signIn')}
              titleFontSize={18}
              titleColor="#FFF"
              backgroundColor="#1C83F7"
              borderRadius={25}
              onPress={this.clickSignIn.bind(this)}
            />

            <TouchableOpacity
              style={{padding: 20, paddingTop: 15, alignItems: 'center'}}
              onPress={() => this.props.navigation.navigate('ForgotPassword')}>
              <Text style={{fontSize: 15, textDecorationLine: 'underline'}}>
                {I18n.t('button.forgotPassword')}
              </Text>
            </TouchableOpacity>

            <AnimateLoadingButton
              ref={c => (this.loadingGoToSignUp = c)}
              width={width - 25}
              height={50}
              title={I18n.t('button.signUp')}
              titleFontSize={18}
              titleColor="#FFF"
              backgroundColor="#F71C58"
              borderRadius={25}
              onPress={this.goToSignUp.bind(this)}
            />
          </View>
        </View>
      </View>
    );
  }
}

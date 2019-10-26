import React, { Component } from 'react';
import {
  Alert,
  View,
  Dimensions,
  TouchableOpacity,
  Modal,
  StatusBar
} from 'react-native';
import {
  Appbar,
  Text,
  HelperText,
  TextInput
} from 'react-native-paper';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import I18n from '../../../components/i18n';
import { showMessage, hideMessage } from 'react-native-flash-message';
import * as Api from '../../../util/Api'
import AsyncStorage from '@react-native-community/async-storage';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class LoginView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }

  componentDidMount = async () => {
  }

  appHerder() {
    return (
      <View>
        <StatusBar backgroundColor='#1C83F7' barStyle='light-content' />
        <Appbar.Header style={{ backgroundColor: '#1C83F7' }}>
          <Appbar.Content
            title='Family Plan'
          />
        </Appbar.Header>
      </View>
    )
  }

  clickSignIn() {
    this.loadingLogin.showLoading(true);
    this.signIn();
  }

  async signIn() {
    let params = {
      email: this.state.email,
      password: this.state.password
    }

    let response = await Api.signIn(params);
    if (response.success) {
      this.loadingLogin.showLoading(false);
      await AsyncStorage.setItem('userToken', response.user.authentication_token);
      showMessage({
        message: I18n.t('message.success'),
        description: I18n.t('message.signInSuccessful'),
        type: 'default',
        backgroundColor: '#02E35E',
        color: '#FFF',
        duration: 3000
      });
      this.props.navigation.navigate('Home')
    } else {
      this.loadingLogin.showLoading(false);
      showMessage({
        message: I18n.t('message.notValidate'),
        description: I18n.t('message.EmailOrPasswordMismatch'),
        type: 'default',
        backgroundColor: '#F60745',
        color: '#FFF',
        duration: 3000
      });
    }
  }

  goToSignUp() {
    this.loadingGoToSignUp.showLoading(true);
    setTimeout(() => {
      this.loadingGoToSignUp.showLoading(false);
      this.props.navigation.navigate('Register')
    }, 500);
  }

  validateEmail(email) {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return reg.test(email) === false
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.appHerder()}
        <View style={{ padding: 45, alignSelf: 'center' }}>
          <Text style={{ alignItems: 'center', fontSize: 58 }}>Sign In</Text>
        </View>
        <View style={{ padding: 15 }}>
          <TextInput
            style={{ paddingBottom: 7 }}
            label={I18n.t('placeholder.email')}
            mode='outlined'
            value={this.state.email}
            onChangeText={email => this.setState({ email: email })}
          />
          <HelperText
            type='error'
            visible={this.validateEmail(this.state.email) && this.state.email != ''}
          >
            {I18n.t('message.emailIsInvalid')}
          </HelperText>

          <TextInput
            secureTextEntry
            autoCorrect={false}
            style={{ paddingBottom: 7 }}
            label={I18n.t('placeholder.password')}
            mode='outlined'
            value={this.state.password}
            onChangeText={password => this.setState({ password: password })}
          />
          <HelperText
            type='error'
            visible={this.state.password.length < 6 && this.state.password != ''}
          >
            {I18n.t('message.passwordLessThanSix')}
          </HelperText>

          <View style={{ justifyContent: 'center', paddingTop: 25 }}>
            <AnimateLoadingButton
              ref={load => (this.loadingLogin = load)}
              width={width - 25}
              height={50}
              title={I18n.t('button.signIn')}
              titleFontSize={18}
              titleColor='#FFF'
              backgroundColor='#1C83F7'
              borderRadius={25}
              onPress={this.clickSignIn.bind(this)}
            />

            <TouchableOpacity
              style={{ padding: 20, paddingTop: 30, alignItems: 'center' }}
              onPress={() => this.props.navigation.navigate('ForgotPassword')}>
              <Text style={{ fontSize: 15, textDecorationLine: 'underline' }}>Forgot your password ?</Text>
            </TouchableOpacity>

            <AnimateLoadingButton
              ref={c => (this.loadingGoToSignUp = c)}
              width={width - 25}
              height={50}
              title={I18n.t('button.signUp')}
              titleFontSize={18}
              titleColor='#FFF'
              backgroundColor='#F71C58'
              borderRadius={25}
              onPress={this.goToSignUp.bind(this)}
            />
          </View>
        </View>
      </View >
    );
  }
};
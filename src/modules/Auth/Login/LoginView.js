import React, { Component } from 'react';
import {
  AsyncStorage,
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
    this.loadingLogin.showLoading(true)
    this.signIn()
  }

  async signIn() {
    let params = {
      email: this.state.email,
      password: this.state.password
    }

    console.log(">>>>")
    console.log(params)
    let response = await Api.signIn(params);
    console.log(response)
    if (response.success) {
      this.loadingSignUp.showLoading(false)
      await AsyncStorage.setItem('userToken', response.user.authentication_token);
      showMessage({
        message: 'Sign In success',
        type: 'success',
      });
      this.props.navigation.navigate('Home')
    } else {
      this.loadingSignUp.showLoading(false)
      showMessage({
        message: I18n.t('message.notValidate'),
        description: I18n.t('message.EmailOrPasswordMismatch'),
        type: 'danger',
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

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.appHerder()}
        <View style={{ padding: 45, alignSelf: 'center' }}>
          <Text style={{ alignItems: 'center', fontSize: 58 }}>Sign In</Text>
        </View>
        <View style={{ padding: 15 }}>
          <TextInput
            style={{ paddingBottom: 13 }}
            label='Email'
            mode='outlined'
            value={this.state.email}
            onChangeText={email => this.setState({ email: email })}
          />

          <TextInput
            secureTextEntry
            autoCorrect={false}
            style={{ paddingBottom: 13 }}
            label='Password'
            mode='outlined'
            value={this.state.password}
            onChangeText={password => this.setState({ password: password })}
          />

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
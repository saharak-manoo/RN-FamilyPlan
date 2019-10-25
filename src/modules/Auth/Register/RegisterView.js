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

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class RegisterView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      confirmPassword: ''
    };
  }

  appHerder() {
    return (
      <View>
        <StatusBar backgroundColor='#1C83F7' barStyle='light-content' />
        <Appbar.Header style={{ backgroundColor: '#1C83F7' }}>
          <Appbar.BackAction onPress={() => this.props.navigation.navigate('Login')} />
          <Appbar.Content
            title='Family Plan'
          />
        </Appbar.Header>
      </View>
    )
  }

  signUp() {
    this.loadingSignUp.showLoading(true);
    setTimeout(() => {
      this.loadingSignUp.showLoading(false);
      showMessage({
        message: 'Sign Up',
        description: 'Sign Up Done.',
        type: 'success',
      });
      this.props.navigation.navigate('Login')
    }, 300);
  }

  goToSignIn() {
    this.loadingGoToSignIn.showLoading(true);
    setTimeout(() => {
      this.loadingGoToSignIn.showLoading(false);
      this.props.navigation.navigate('Login')
    }, 300);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.appHerder()}
        <View style={{ padding: 45, alignSelf: 'center' }}>
          <Text style={{ alignItems: 'center', fontSize: 58 }}>Sign Up</Text>
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
            style={{ paddingBottom: 13 }}
            label='Password'
            mode='outlined'
            value={this.state.password}
            onChangeText={password => this.setState({ password: password })}
          />

          <TextInput
            style={{ paddingBottom: 13 }}
            label='Confirm Password'
            mode='outlined'
            value={this.state.confirmPassword}
            onChangeText={confirmPassword => this.setState({ confirmPassword: confirmPassword })}
          />

          <View style={{ justifyContent: 'center', paddingTop: 25 }}>
            <AnimateLoadingButton
              ref={load => (this.loadingSignUp = load)}
              width={width - 25}
              height={50}
              title={I18n.t('button.signUp')}
              titleFontSize={18}
              titleColor='#FFF'
              backgroundColor='#1C83F7'
              borderRadius={25}
              onPress={this.signUp.bind(this)}
            />

            <TouchableOpacity
              style={{ padding: 20, paddingTop: 30, alignItems: 'center' }}
              onPress={() => this.props.navigation.navigate('ForgotPassword')}>
              <Text style={{ fontSize: 15, textDecorationLine: 'underline' }}>Forgot your password ?</Text>
            </TouchableOpacity>

            <AnimateLoadingButton
              ref={c => (this.loadingGoToSignIn = c)}
              width={width - 25}
              height={50}
              title={I18n.t('button.signIn')}
              titleFontSize={18}
              titleColor='#FFF'
              backgroundColor='#F71C58'
              borderRadius={25}
              onPress={this.goToSignIn.bind(this)}
            />
          </View>
        </View>
      </View >
    );
  }
};
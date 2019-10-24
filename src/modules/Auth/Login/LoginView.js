import React, { Component } from 'react';
import {
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

// View
import ForgotPasswordView from '../ForgotPassword/ForgotPasswordView';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class LoginView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      forgotPasswordModal: false,
      signUpModal: false,
      email: '',
      password: ''
    };
  }

  appHerder() {
    return (
      <View>
        <StatusBar backgroundColor='#E05100' barStyle='light-content' />
        <Appbar.Header style={{ backgroundColor: '#E05100' }}>
          <Appbar.Action icon='close' onPress={() => this.props.back()} />
          <Appbar.Content
            title='Login'
          />
        </Appbar.Header>
      </View>
    )
  }

  logIn() {
    showMessage({
      message: 'Hello World',
      description: 'This is our second message',
      type: 'success',
    });

    this.loadingLogin.showLoading(true);

    // mock
    setTimeout(() => {
      this.loadingLogin.showLoading(false);
      alert('Login')
    }, 2000);
  }

  forgotPasswordModal() {
    return (
      <Modal
        animationType='slide'
        transparent={false}
        visible={this.state.forgotPasswordModal}
        onRequestClose={() => {
          this.setState({ forgotPasswordModal: false });
        }}
      >
        <ForgotPasswordView
          back={
            () => {
              this.setState({ forgotPasswordModal: false });
            }}
        />
      </Modal>
    )
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.appHerder()}
        <View style={{ padding: 45 }}>
          <Text style={{ alignItems: 'center', fontSize: 58 }}>Family Plan</Text>
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
              onPress={this.logIn.bind(this)}
            />

            <TouchableOpacity
              style={{ padding: 20, paddingTop: 30, alignItems: 'center' }}
              onPress={() => this.setState({ forgotPasswordModal: true })}>
              <Text style={{ fontSize: 15, textDecorationLine: 'underline' }}>Forgot your password ?</Text>
            </TouchableOpacity>

            <AnimateLoadingButton
              ref={c => (this.loadingButton = c)}
              width={width - 25}
              height={50}
              title={I18n.t('button.signUp')}
              titleFontSize={18}
              titleColor='#FFF'
              backgroundColor='#F71C58'
              borderRadius={25}
            />
          </View>
        </View>

        {this.forgotPasswordModal()}
      </View>
    );
  }
};
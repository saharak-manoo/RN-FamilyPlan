import React, { Component } from 'react';
import {
  Alert,
  AsyncStorage,
  View,
  Dimensions,
  Platform,
  TouchableOpacity,
  Modal,
  ScrollView,
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
import { Dropdown } from 'react-native-material-dropdown';
import * as Api from '../../../util/Api'
import * as GFunction from '../../../util/GlobalFunction'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class RegisterView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      prefixs: [
        {
          value: I18n.t('text.mr'),
          en: 'mr'
        },
        {
          value: I18n.t('text.mrs'),
          en: 'mrs'
        },
        {
          value: I18n.t('text.miss'),
          en: 'miss'
        }
      ],
      prefix: 'Mr',
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
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

  validate() {
    if (this.state.password && this.state.confirmPassword) {
      if (this.state.password.length < 6 || this.state.confirmPassword < 6) {
        showMessage({
          message: I18n.t('message.notValidate'),
          description: I18n.t('message.passwordLessThanSix'),
          type: 'danger',
        });
        this.loadingSignUp.showLoading(false)
      } else {
        if (this.state.password !== this.state.confirmPassword) {
          showMessage({
            message: I18n.t('message.notValidate'),
            description: I18n.t('message.passwordNotMatch'),
            type: 'danger',
          });
          this.loadingSignUp.showLoading(false)
        } else {
          this.saveUser();
        }
      }
    } else {
      showMessage({
        message: I18n.t('message.notValidate'),
        description: I18n.t('message.pleaseInputAllValue'),
        type: 'danger',
      });
      this.loadingSignUp.showLoading(false)
    }
  }

  clickSignUp() {
    this.loadingSignUp.showLoading(true)
    this.validate()
  }

  async saveUser() {
    let titleSelected = this.state.prefixs.filter(f => f.value == this.state.prefix)[0].en
    let params = {
      prefix: titleSelected,
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      email: this.state.email,
      phone_number: this.state.phoneNumber,
      password: this.state.password,
      confirm_password: this.state.confirmPassword
    }

    let response = await Api.createUser(params);
    if (response.success) {
      this.loadingSignUp.showLoading(false)
      await AsyncStorage.setItem('userToken', response.user.authentication_token);
      showMessage({
        message: 'Sign up success',
        type: 'success',
      });
      this.props.navigation.navigate('Home')
    } else {
      this.loadingSignUp.showLoading(false)
      let errors = [];
      response.error.map((error, i) => {
        errors.splice(i, 0, I18n.t(`message.${GFunction.camelize(error)}`));
      });
      showMessage({
        message: I18n.t('message.notValidate'),
        description: errors.join('\n'),
        type: 'danger',
      });
    }

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
        <ScrollView style={{ flex: 1 }}>
          <View style={{ padding: 25, alignSelf: 'center' }}>
            <Text style={{ alignItems: 'center', fontSize: 58 }}>Sign Up</Text>
          </View>
          <View style={{ padding: 15 }}>
            <Dropdown
              label={<Text style={{ color: '#6d6b6b' }}>{I18n.t('placeholder.prefix')}</Text>}
              labelFontSize={Platform.isPad ? 22 : 12}
              fontSize={Platform.isPad ? 25 : 16}
              data={this.state.prefixs}
              baseColor='#2d2c2c'
              selectedItemColor='#222'
              dropdownPosition={0}
              value={this.state.prefix}
              onChangeText={prefix => this.setState({ prefix: prefix })}
            />

            <TextInput
              style={{ paddingBottom: 13 }}
              label={I18n.t('placeholder.firstName')}
              mode='outlined'
              value={this.state.firstName}
              onChangeText={firstName => this.setState({ firstName: firstName })}
            />

            <TextInput
              style={{ paddingBottom: 13 }}
              label={I18n.t('placeholder.lastName')}
              mode='outlined'
              value={this.state.lastName}
              onChangeText={lastName => this.setState({ lastName: lastName })}
            />

            <TextInput
              style={{ paddingBottom: 13 }}
              label={I18n.t('placeholder.email')}
              mode='outlined'
              value={this.state.email}
              onChangeText={email => this.setState({ email: email })}
            />

            <TextInput
              keyboardType='numeric'
              maxLength={10}
              style={{ paddingBottom: 13 }}
              label={I18n.t('placeholder.phoneNumber')}
              mode='outlined'
              value={this.state.phoneNumber}
              onChangeText={phoneNumber => this.setState({ phoneNumber: phoneNumber.replace(/[^0-9]/g, '') })}
            />

            <TextInput
              secureTextEntry
              autoCorrect={false}
              style={{ paddingBottom: 13 }}
              label={I18n.t('placeholder.password')}
              mode='outlined'
              value={this.state.password}
              onChangeText={password => this.setState({ password: password })}
            />

            <TextInput
              secureTextEntry
              autoCorrect={false}
              style={{ paddingBottom: 13 }}
              label={I18n.t('placeholder.confirmPassword')}
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
                onPress={this.clickSignUp.bind(this)}
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
        </ScrollView>
      </View >
    );
  }
};
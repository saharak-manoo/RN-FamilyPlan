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
import {Appbar, Text, HelperText, TextInput} from 'react-native-paper';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import I18n from '../../../components/i18n';
import {Dropdown} from 'react-native-material-dropdown';
import * as Api from '../../../util/Api';
import * as GFunction from '../../../util/GlobalFunction';
import AsyncStorage from '@react-native-community/async-storage';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class RegisterView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
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
      firstName: null,
      lastName: null,
      email: '',
      phoneNumber: '',
      password: '',
      confirmPassword: '',
    };
  }

  componentDidMount = async () => {
    this.setState({spinner: true});
    let locale = await AsyncStorage.getItem('locale');
    this.setState({prefix: locale === 'th' ? 'นาย' : 'Mr'});
  };

  appHerder() {
    return (
      <View>
        <StatusBar backgroundColor="#1C83F6" barStyle="light-content" />
        <Appbar.Header style={{backgroundColor: '#1C83F6'}}>
          <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content title={I18n.t('placeholder.appName')} />
        </Appbar.Header>
      </View>
    );
  }

  validate() {
    if (this.state.password && this.state.confirmPassword) {
      if (this.state.password.length < 6 || this.state.confirmPassword < 6) {
        GFunction.errorMessage(
          I18n.t('message.notValidate'),
          I18n.t('message.passwordLessThanSix'),
        );
        this.loadingSignUp.showLoading(false);
      } else {
        if (this.state.password !== this.state.confirmPassword) {
          GFunction.errorMessage(
            I18n.t('message.notValidate'),
            I18n.t('message.passwordNotMatch'),
          );
          this.loadingSignUp.showLoading(false);
        } else {
          this.saveUser();
        }
      }
    } else {
      GFunction.errorMessage(
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
      f => f.value == this.state.prefix,
    )[0].en;
    let params = {
      prefix: titleSelected,
      first_name: this.state.firstName,
      last_name: this.state.lastName,
      email: this.state.email,
      phone_number: this.state.phoneNumber,
      password: this.state.password,
      confirm_password: this.state.confirmPassword,
    };

    let response = await Api.signUp(params);
    console.log(response);
    if (response.success) {
      this.loadingSignUp.showLoading(false);
      await AsyncStorage.setItem('user', JSON.stringify(response.user));
      GFunction.successMessage(
        I18n.t('message.success'),
        I18n.t('message.signUpSuccessful'),
      );
      this.props.navigation.navigate('Home');
    } else {
      this.loadingSignUp.showLoading(false);
      let errors = [];
      response.error.map((error, i) => {
        errors.splice(i, 0, I18n.t(`message.${GFunction.camelize(error)}`));
      });
      GFunction.errorMessage(I18n.t('message.notValidate'), errors.join('\n'));
    }
  }

  goToSignIn() {
    this.loadingGoToSignIn.showLoading(true);
    setTimeout(() => {
      this.loadingGoToSignIn.showLoading(false);
      this.props.navigation.navigate('Login');
    }, 300);
  }

  render() {
    return (
      <View style={{flex: 1}}>
        {this.appHerder()}
        <ScrollView style={{flex: 1}}>
          <View style={{padding: 25, alignSelf: 'center'}}>
            <Text style={{alignSelf: 'center', fontSize: 38}}>
              {I18n.t('button.signUp')}
            </Text>
          </View>
          <View style={{padding: 15}}>
            <Dropdown
              label={
                <Text style={{color: '#6d6b6b'}}>
                  {I18n.t('placeholder.prefix')}
                </Text>
              }
              labelFontSize={Platform.isPad ? 22 : 12}
              fontSize={Platform.isPad ? 25 : 16}
              data={this.state.prefixs}
              baseColor="#2d2c2c"
              selectedItemColor="#222"
              dropdownPosition={0}
              value={this.state.prefix}
              onChangeText={prefix => this.setState({prefix: prefix})}
            />

            <TextInput
              style={{paddingBottom: 6, paddingTop: 15}}
              label={I18n.t('placeholder.firstName')}
              mode="outlined"
              value={this.state.firstName}
              onChangeText={firstName => this.setState({firstName: firstName})}
            />
            <HelperText
              type="error"
              visible={GFunction.validateBlank(this.state.firstName)}>
              {I18n.t('message.firstNameCannotBeBlank')}
            </HelperText>

            <TextInput
              style={{paddingBottom: 6}}
              label={I18n.t('placeholder.lastName')}
              mode="outlined"
              value={this.state.lastName}
              onChangeText={lastName => this.setState({lastName: lastName})}
            />
            <HelperText
              type="error"
              visible={GFunction.validateBlank(this.state.lastName)}>
              {I18n.t('message.lastNameCannotBeBlank')}
            </HelperText>

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
              keyboardType="numeric"
              maxLength={10}
              style={{paddingBottom: 6}}
              label={I18n.t('placeholder.phoneNumber')}
              mode="outlined"
              value={this.state.phoneNumber}
              onChangeText={phoneNumber =>
                this.setState({phoneNumber: phoneNumber.replace(/[^0-9]/g, '')})
              }
            />
            <HelperText
              type="error"
              visible={GFunction.validatePhoneNumber(this.state.phoneNumber)}>
              {I18n.t('message.telephoneMustBeTen')}
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

            <TextInput
              secureTextEntry
              autoCorrect={false}
              style={{paddingBottom: 6}}
              label={I18n.t('placeholder.confirmPassword')}
              mode="outlined"
              value={this.state.confirmPassword}
              onChangeText={confirmPassword =>
                this.setState({confirmPassword: confirmPassword})
              }
            />
            <HelperText
              type="error"
              visible={GFunction.validatePasswordMatch(
                this.state.password,
                this.state.confirmPassword,
              )}>
              {I18n.t('message.passwordNotMatch')}
            </HelperText>

            <View style={{justifyContent: 'center', paddingTop: 10}}>
              <AnimateLoadingButton
                ref={load => (this.loadingSignUp = load)}
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
                style={{padding: 20, paddingTop: 15, alignItems: 'center'}}
                onPress={() =>
                  this.props.navigation.navigate('ForgotPassword')
                }>
                <Text style={{fontSize: 15, textDecorationLine: 'underline'}}>
                  {I18n.t('button.forgotPassword')}
                </Text>
              </TouchableOpacity>

              <AnimateLoadingButton
                ref={c => (this.loadingGoToSignIn = c)}
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
      </View>
    );
  }
}

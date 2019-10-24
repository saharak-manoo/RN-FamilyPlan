import React, { Component } from 'react';
import {
  View,
  Dimensions,
  TouchableOpacity,
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

export default class ForgotPasswordView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      email: ''
    };
  }

  appHerder() {
    return (
      <View>
        <StatusBar backgroundColor='#0144A4' barStyle='light-content' />
        <Appbar.Header style={{ backgroundColor: '#0144A4' }}>
          <Appbar.BackAction
            onPress={() => this.props.back()}
          />
          <Appbar.Content
            title='Forgot password'
          />
        </Appbar.Header>
      </View>
    )
  }

  submit() {
    showMessage({
      message: 'Hello World',
      description: 'This is our second message',
      type: 'success',
    });

    this.loading.showLoading(true);

    // mock
    setTimeout(() => {
      this.loading.showLoading(false);
      alert('Forgot Password')
    }, 2000);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.appHerder()}
        <View style={{ padding: 45, alignContent: 'center' }}>
          <Text style={{ alignItems: 'center', fontSize: 38 }}>Forgot Password</Text>
        </View>
        <View style={{ padding: 15 }}>
          <TextInput
            style={{ paddingBottom: 13 }}
            label='Email'
            mode='outlined'
            value={this.state.email}
            onChangeText={email => this.setState({ email: email })}
          />

          <View style={{ justifyContent: 'center', paddingTop: 25 }}>
            <AnimateLoadingButton
              ref={load => (this.loading = load)}
              width={width - 25}
              height={50}
              title={I18n.t('button.resetPassword')}
              titleFontSize={18}
              titleColor='#FFF'
              backgroundColor='#1C83F7'
              borderRadius={25}
              onPress={this.submit.bind(this)}
            />
          </View>
        </View>
      </View>
    );
  }
};
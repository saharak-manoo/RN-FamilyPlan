import React, { Component } from 'react';
import {
  StatusBar,
  View,
  Dimensions
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

export default class LoginView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
  }

  AppHerder() {
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

  _onPressHandler() {
    showMessage({
      message: 'Hello World',
      description: 'This is our second message',
      type: 'success',
    });

    this.loadingButton.showLoading(true);

    // mock
    setTimeout(() => {
      this.loadingButton.showLoading(false);
    }, 2000);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.AppHerder()}
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

          <View style={{ flex: 1, justifyContent: 'center' }}>
            <AnimateLoadingButton
              ref={c => (this.loadingButton = c)}
              width={width - 25}
              height={50}
              title={I18n.t('button.signIn')}
              titleFontSize={16}
              titleColor='#FFF'
              backgroundColor='#F7301C'
              borderRadius={4}
              onPress={this._onPressHandler.bind(this)}
            />
          </View>
        </View>
      </View>
    );
  }
};
import React, { Component } from 'react';
import {
  StatusBar,
  View
} from 'react-native';
import {
  Appbar,
  Text,
  HelperText,
  TextInput
} from 'react-native-paper';

export default class LoginView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      email: ''
    };
  }

  goBack() {
    this.props.navigation.goBack();
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

  render() {
    return (
      <View>
        {this.AppHerder()}
        <TextInput
          label='Email'
          mode='outlined'
          value={this.state.email}
          onChangeText={email => this.setState({ email: email })}
        />
        <HelperText
          type='error'
          visible={!this.state.email.includes('@')}
        >
          Email address is invalid!
        </HelperText>
      </View>
    );
  }
};
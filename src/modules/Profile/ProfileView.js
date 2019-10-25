import React, { Component } from 'react';
import {
  AsyncStorage,
  Dimensions,
  StatusBar,
  View
} from 'react-native';
import {
  Appbar,
  Text
} from 'react-native-paper';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import I18n from '../../components/i18n';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class ProfileView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false
    };
  }

  AppHerder() {
    return (
      <View>
        <StatusBar backgroundColor='#6D06F9' barStyle='light-content' />
        <Appbar.Header style={{ backgroundColor: '#6D06F9' }}>
          <Appbar.Content
            title='Profile'
          />
        </Appbar.Header>
      </View>
    )
  }

  signOut() {
    this.loadingSignOut.showLoading(true);

    // mock
    setTimeout(() => {
      AsyncStorage.removeItem('isSignIn')
      this.loadingSignOut.showLoading(false);
      this.props.navigation.navigate('Login');
    }, 2000);
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.AppHerder()}
        <View>
          <View style={{ padding: 45 }}>
            <Text style={{ alignItems: 'center', fontSize: 38 }}>Your can't sign in</Text>
          </View>
          <View style={{ justifyContent: 'center', paddingTop: 25 }}>
            <AnimateLoadingButton
              ref={load => (this.loadingSignOut = load)}
              width={width - 25}
              height={50}
              title={I18n.t('button.signOut')}
              titleFontSize={18}
              titleColor='#FFF'
              backgroundColor='#F71C58'
              borderRadius={25}
              onPress={this.signOut.bind(this)}
            />
          </View>
        </View>
      </View>
    );
  }
};
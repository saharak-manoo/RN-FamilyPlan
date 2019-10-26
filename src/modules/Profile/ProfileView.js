import React, { Component } from 'react';
import {
  Alert,
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
import AsyncStorage from '@react-native-community/async-storage';
import * as Api from '../../util/Api'
import * as GFunction from '../../util/GlobalFunction'

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class ProfileView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      isLogin: false,
      user: null
    };
  }

  componentDidMount = async () => {
    this.setState({ user: await GFunction.user() })
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

  clickSignOut() {
    this.loadingSignOut.showLoading(true)
    this.signOut()
  }

  // async confirmAction() {
  //   Alert.alert(
  //     I18n.t('message.areYouSure'),
  //     '',
  //     [
  //       {
  //         text: I18n.t('button.cancel'),
  //         onPress: () => this.loadingSignOut.showLoading(false),
  //         style: 'cancel',
  //       },
  //       {
  //         text: I18n.t('button.signOut'),
  //         onPress: this.signOut()
  //       },
  //     ],
  //     { cancelable: false },
  //   );
  // }

  async signOut() {
    let response = await Api.signOut(this.state.user.authentication_token);
    if (response.success) {
      this.loadingSignOut.showLoading(false);
      await AsyncStorage.removeItem('user');
      GFunction.successMessage(I18n.t('message.success'), I18n.t('message.signOutSuccessful'))
      this.props.navigation.navigate('Login')
    } else {
      this.loadingSignOut.showLoading(false);
      GFunction.errorMessage(I18n.t('message.error'), I18n.t('message.signOutFail'))
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.AppHerder()}
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, padding: 45 }}>

          </View>
          <View style={{ flex: 1, justifyContent: 'flex-end', paddingBottom: 10 }}>
            <AnimateLoadingButton
              ref={load => (this.loadingSignOut = load)}
              width={width - 25}
              height={50}
              title={I18n.t('button.signOut')}
              titleFontSize={18}
              titleColor='#FFF'
              backgroundColor='#F71C58'
              borderRadius={25}
              onPress={this.clickSignOut.bind(this)}
            />
          </View>
        </View>
      </View>
    );
  }
};
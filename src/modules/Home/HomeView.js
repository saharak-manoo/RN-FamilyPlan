import React, { Component } from 'react';
import {
  Alert,
  Linking,
  Modal,
  StatusBar,
  TouchableHighlight,
  View,
  StyleSheet
} from 'react-native';
import {
  Appbar,
  Text,
  Searchbar
} from 'react-native-paper';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import AnimateLoadingButton from 'react-native-animate-loading-button';
import { showMessage, hideMessage } from 'react-native-flash-message';
import InAppBrowser from 'react-native-inappbrowser-reborn'
import I18n from '../../components/i18n';

import LoginView from '../Auth/Login/LoginView';

export default class Home extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      modalVisible: false,
    };
  }

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  logInModal() {
    return (
      <Modal
        animationType='slide'
        transparent={false}
        visible={this.state.modalVisible}
        onRequestClose={() => {
          Alert.alert('Modal has been closed.');
        }}>
        <LoginView
          back={
            () => {
              this.setState({ modalVisible: false });
            }}
        />
      </Modal>
    )
  }

  AppHerder() {
    return (
      <View>
        <StatusBar backgroundColor='#2370E6' barStyle='light-content' />
        <Appbar.Header style={{ backgroundColor: '#2370E6' }}>
          <Appbar.Content
            title='Home'
          />
        </Appbar.Header>
      </View>
    )
  }

  _onPressHandler() {
    this.openLink()
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

  async openLink() {
    try {
      const url = 'https://www.google.com'
      if (await InAppBrowser.isAvailable()) {
        const result = await InAppBrowser.open(url, {
          dismissButtonStyle: 'cancel',
          preferredBarTintColor: '#2370E6',
          preferredControlTintColor: 'white',
          readerMode: false,
          modalEnabled: true,
          showTitle: true,
          toolbarColor: '#2370E6',
          secondaryToolbarColor: 'black',
          enableUrlBarHiding: true,
          enableDefaultShare: true,
          forceCloseOnRedirection: false,
          animations: {
            startEnter: 'slide_in_right',
            startExit: 'slide_out_left',
            endEnter: 'slide_in_left',
            endExit: 'slide_out_right'
          },
          waitForRedirectDelay: 0
        })
        Alert.alert(JSON.stringify(result))
      }
      else Linking.openURL(url)
    } catch (error) {
      Alert.alert(error.message)
    }
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.AppHerder()}
        <View>
          <Searchbar
            placeholder='Search'
            onChangeText={searching => { this.setState({ search: searching }); }}
            value={this.state.search}
          />
        </View>

        <View style={{ flex: 1, backgroundColor: 'rgb(255,255,255)', justifyContent: 'center' }}>
          <AnimateLoadingButton
            ref={c => (this.loadingButton = c)}
            width={300}
            height={50}
            title={I18n.t('button.signIn')}
            titleFontSize={16}
            titleColor='rgb(255,255,255)'
            backgroundColor='rgb(29,18,121)'
            borderRadius={4}
            onPress={this._onPressHandler.bind(this)}
          />
        </View>
        {this.logInModal()}
        <ActionButton
          buttonColor='rgba(231,76,60,1)'
          onPress={() => {
            this.setModalVisible(true);
          }}
        />
      </View>
    );
  }
};
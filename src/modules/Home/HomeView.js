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
import I18n from '../../components/i18n';

// View
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
      >
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
            title='Family Plan'
          />
        </Appbar.Header>
      </View>
    )
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
import React, { Component } from 'react';
import {
  Alert,
  Linking,
  Modal,
  StatusBar,
  TouchableHighlight,
  View,
  StyleSheet,
} from 'react-native';
import {
  Appbar,
  Text,
  Searchbar
} from 'react-native-paper';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';
import { styles } from '../../components/styles';
import I18n from '../../components/i18n';

// View
import LoginView from '../Auth/Login/LoginView';

export default class Home extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
    };
  }

  AppHerder() {
    return (
      <View>
        <StatusBar backgroundColor='#2370E6' barStyle='light-content' />
        <Appbar.Header style={{ backgroundColor: '#2370E6' }}>
          <Appbar.Content
            title={I18n.t('message.appName')}
          />
        </Appbar.Header>
      </View>
    )
  }

  render() {
    return (
      <View style={styles.defaultView}>
        {this.AppHerder()}
        <View style={{ padding: 15 }}>
          <Searchbar
            placeholder='Search'
            onChangeText={searching => { this.setState({ search: searching }); }}
            value={this.state.search}
          />
        </View>

        <View>
        </View>
        <ActionButton
          buttonColor='rgba(231,76,60,1)'
        />
      </View>
    );
  }
};
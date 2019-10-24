import React, { Component } from 'react';
import {
  StatusBar,
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

export default class Home extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      search: ''
    };
  }

  AppHerder() {
    return (
      <View>
        <StatusBar backgroundColor="#2370E6" barStyle="light-content" />
        <Appbar.Header style={{ backgroundColor: '#2370E6' }}>
          <Appbar.Content
            title="Home"
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
            placeholder="Search"
            onChangeText={searching => { this.setState({ search: searching }); }}
            value={this.state.search}
          />
        </View>

        <ActionButton
          buttonColor="rgba(231,76,60,1)"
          onPress={() => { console.log("hi") }}
        />
      </View>
    );
  }
};
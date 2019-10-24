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
import AnimateLoadingButton from 'react-native-animate-loading-button';

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

  _onPressHandler() {
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
        <View>
          <Searchbar
            placeholder="Search"
            onChangeText={searching => { this.setState({ search: searching }); }}
            value={this.state.search}
          />
        </View>

        <View style={{ flex: 1, backgroundColor: 'rgb(255,255,255)', justifyContent: 'center' }}>
          <AnimateLoadingButton
            ref={c => (this.loadingButton = c)}
            width={300}
            height={50}
            title="Login"
            titleFontSize={16}
            titleColor="rgb(255,255,255)"
            backgroundColor="rgb(29,18,121)"
            borderRadius={4}
            onPress={this._onPressHandler.bind(this)}
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
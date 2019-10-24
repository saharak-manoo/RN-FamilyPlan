import React, { Component } from 'react';
import {
  BottomNavigation,
  Text
} from 'react-native-paper';

// View
import HomeView from '../Home/HomeView';
import ChatView from '../Chat/ChatView';
import NotificationView from '../Notification/NotificationView';
import SettingView from '../Setting/SettingView';

export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: 'homes', title: 'Home', icon: 'home', color: '#2370E6' },
        { key: 'chats', title: 'Chats', icon: 'chat', color: '#09A650' },
        { key: 'notifications', title: 'Notifications', icon: 'bell', color: '#F93636' },
        { key: 'settings', title: 'Settings', icon: 'settings', color: '#6D06F9' },
      ],
    };
  }

  _handleIndexChange = index => this.setState({ index });

  _renderScene = BottomNavigation.SceneMap({
    homes: HomeView,
    chats: ChatView,
    notifications: NotificationView,
    settings: SettingView,
  });

  render() {
    return (
      <BottomNavigation
        navigationState={this.state}
        onIndexChange={this._handleIndexChange}
        renderScene={this._renderScene}
      />
    );
  }
};
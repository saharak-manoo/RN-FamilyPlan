import React, { Component } from 'react';
import {
  BottomNavigation,
  Text
} from 'react-native-paper';

const HomeRoute = () => <Text>Home</Text>;
const ChatsRoute = () => <Text>Chats</Text>;
const NotificationsRoute = () => <Text>Notifications</Text>;
const SettingsRoute = () => <Text>Settings</Text>;

export default class App extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: 'home', title: 'Home', icon: 'home', color: '#3F51B5' },
        { key: 'chats', title: 'Chats', icon: 'chat', color: '#009688' },
        { key: 'notifications', title: 'Notifications', icon: 'bell', color: '#795548' },
        { key: 'settings', title: 'Settings', icon: 'settings', color: '#607D8B' },
      ],
    };
  }

  _handleIndexChange = index => this.setState({ index });

  _renderScene = BottomNavigation.SceneMap({
    home: HomeRoute,
    chats: ChatsRoute,
    notifications: NotificationsRoute,
    settings: SettingsRoute,
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
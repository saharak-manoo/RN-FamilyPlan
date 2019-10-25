import React, { Component } from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

// View
import HomeView from '../Home/HomeView';
import ChatView from '../Chat/ChatView';
import NotificationView from '../Notification/NotificationView';
import SettingView from '../Setting/SettingView';

const MainNavigator = createMaterialBottomTabNavigator(
  {
    Home: {
      screen: HomeView,
      navigationOptions: {
        title: 'Home',
        tabBarLabel: 'Home',
        tabBarColor: '#2370E6',
        tabBarIcon: () => (
          <Icon size={25} name='home' color='#FFF' />
        )
      }
    },
    Chat: {
      screen: ChatView,
      navigationOptions: {
        title: 'Chat',
        tabBarLabel: 'Chat',
        tabBarColor: '#09A650',
        tabBarIcon: () => (
          <Icon size={25} name='chat' color='#FFF' />
        )
      }
    },
    Notification: {
      screen: NotificationView,
      navigationOptions: {
        title: 'Notifications',
        tabBarLabel: 'Notifications',
        tabBarColor: '#F93636',
        tabBarIcon: () => (
          <Icon size={25} name='notifications' color='#FFF' />
        )
      }
    },
    Setting: {
      screen: SettingView,
      navigationOptions: {
        title: 'Settings',
        tabBarLabel: 'Settings',
        tabBarColor: '#6D06F9',
        tabBarIcon: () => (
          <Icon size={25} name='settings' color='#FFF' />
        )
      }
    },
  },
  {
    initialRouteName: 'Home',
    activeColor: '#f0edf6',
    inactiveColor: '#3e2465',
    barStyle: { backgroundColor: '#2370E6' },
  },
);

const Navigator = createAppContainer(MainNavigator);

export default Navigator;
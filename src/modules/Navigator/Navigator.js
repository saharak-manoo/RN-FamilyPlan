import React, { Component } from 'react';
import { createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';

// View
import HomeView from '../Home/HomeView';
import ChatView from '../Chat/ChatView';
import NotificationView from '../Notification/NotificationView';
import ProfileView from '../Profile/ProfileView';
import LoginView from '../Auth/Login/LoginView';
import RegisterView from '../Auth/Register/RegisterView';
import ForgotPasswordView from '../Auth/ForgotPassword/ForgotPasswordView';

const HomeStack = createStackNavigator(
  {
    Home: { screen: HomeView },
  },
  {
    headerMode: 'none',
  }
);

const AuthStack = createStackNavigator(
  {
    Login: { screen: LoginView },
    Register: { screen: RegisterView },
    ForgotPassword: { screen: ForgotPasswordView }
  },
  { headerMode: 'none' }
);


const ProfileStack = createStackNavigator(
  {
    Profile: { screen: ProfileView },
  },
  {
    headerMode: 'none',
  }
);


const MainNavigator = createMaterialBottomTabNavigator(
  {
    Home: {
      screen: HomeStack,
      navigationOptions: {
        title: 'Home',
        tabBarLabel: 'Home',
        tabBarColor: '#2370E6',
        tabBarIcon: () => (
          <Icon size={26} name='home' color='#FFF' />
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
          <Icon size={26} name='chat' color='#FFF' />
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
          <Icon size={26} name='notifications' color='#FFF' />
        )
      }
    },
    Profile: {
      screen: ProfileStack,
      navigationOptions: {
        title: 'Profile',
        tabBarLabel: 'Profile',
        tabBarColor: '#6D06F9',
        tabBarIcon: () => (
          <Icon size={26} name='account-box' color='#FFF' />
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

const AppNavigator = createStackNavigator(
  {
    Auth: AuthStack,
    App: MainNavigator,
  },
  {
    headerMode: 'none',
    initialRouteName: 'Auth'
  }
);

const Navigator = createAppContainer(AppNavigator);

export default Navigator;
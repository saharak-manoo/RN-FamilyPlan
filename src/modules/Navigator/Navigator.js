import React, { Component } from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createMaterialBottomTabNavigator } from 'react-navigation-material-bottom-tabs';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import I18n from '../../components/i18n';

// View
import HomeView from '../Home/HomeView';
import ChatView from '../Chat/ChatView';
import NotificationView from '../Notification/NotificationView';
import ProfileView from '../Profile/ProfileView';
import LoginView from '../Auth/Login/LoginView';
import RegisterView from '../Auth/Register/RegisterView';
import ForgotPasswordView from '../Auth/ForgotPassword/ForgotPasswordView';
import LogoView from '../Logo/LogoView';

const HomeStack = createStackNavigator(
  {
    Home: { screen: HomeView },
  },
  {
    headerMode: 'none'
  }
);

const AuthStack = createStackNavigator(
  {
    Login: { screen: LoginView },
    Register: { screen: RegisterView },
    ForgotPassword: { screen: ForgotPasswordView }
  },
  {
    headerMode: 'none'
  }
);


const ProfileStack = createStackNavigator(
  {
    Profile: { screen: ProfileView },
  },
  {
    headerMode: 'none'
  }
);


const MainNavigator = createMaterialBottomTabNavigator(
  {
    Home: {
      screen: HomeStack,
      navigationOptions: {
        title: I18n.t('message.home'),
        tabBarLabel: I18n.t('message.home'),
        tabBarColor: '#2370E6',
        tabBarIcon: () => (
          <MatIcon size={26} name='home' color='#FFF' />
        )
      }
    },
    Chat: {
      screen: ChatView,
      navigationOptions: {
        title: I18n.t('message.chat'),
        tabBarLabel: I18n.t('message.chat'),
        tabBarColor: '#09A650',
        tabBarIcon: () => (
          <MatIcon size={26} name='chat' color='#FFF' />
        )
      }
    },
    Notification: {
      screen: NotificationView,
      navigationOptions: {
        title: I18n.t('message.notifications'),
        tabBarLabel: I18n.t('message.notifications'),
        tabBarColor: '#F93636',
        tabBarIcon: () => (
          <MatIcon size={26} name='notifications' color='#FFF' />
        )
      }
    },
    Profile: {
      screen: ProfileStack,
      navigationOptions: {
        title: I18n.t('message.profile'),
        tabBarLabel: I18n.t('message.profile'),
        tabBarColor: '#6D06F9',
        tabBarIcon: () => (
          <MatIcon size={26} name='account-box' color='#FFF' />
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

const AppNavigator = createSwitchNavigator(
  {
    Logo: LogoView,
    Auth: AuthStack,
    App: MainNavigator,
  },
  {
    headerMode: 'none',
    initialRouteName: 'Logo'
  }
);

const Navigator = createAppContainer(AppNavigator);

export default Navigator;
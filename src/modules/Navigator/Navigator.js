import React, {Component} from 'react';
import {View} from 'react-native';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import I18n from '../../components/i18n';
import AsyncStorage from '@react-native-community/async-storage';
import {Badge} from 'react-native-elements';

// View
import HomeView from '../Home/HomeView';
import ChatListView from '../Chat/ChatListView';
import ChatView from '../Chat/ChatView';
import NotificationView from '../Notification/NotificationView';
import ProfileView from '../Profile/ProfileView';
import LoginView from '../Auth/Login/LoginView';
import RegisterView from '../Auth/Register/RegisterView';
import ForgotPasswordView from '../Auth/ForgotPassword/ForgotPasswordView';
import LogoView from '../Logo/LogoView';
import GroupView from '../Home/Group/GroupView';

const HomeStack = createStackNavigator(
  {
    Home: {screen: HomeView},
    Group: {screen: GroupView},
  },
  {
    headerMode: 'none',
  },
);

const ChatStack = createStackNavigator(
  {
    ChatList: {screen: ChatListView},
    ChatRoom: {screen: ChatView},
  },
  {
    headerMode: 'none',
  },
);

const AuthStack = createStackNavigator(
  {
    Login: {screen: LoginView},
    Register: {screen: RegisterView},
    ForgotPassword: {screen: ForgotPasswordView},
  },
  {
    headerMode: 'none',
  },
);

const ProfileStack = createStackNavigator(
  {
    Profile: {screen: ProfileView},
  },
  {
    headerMode: 'none',
  },
);

const MainNavigator = createMaterialBottomTabNavigator(
  {
    Home: {
      screen: HomeStack,
      navigationOptions: {
        title: I18n.t('placeholder.home'),
        tabBarLabel: I18n.t('placeholder.home'),
        tabBarColor: '#2370E6',
        tabBarIcon: () => <MatIcon size={26} name="home" color="#FFF" />,
      },
    },
    Chat: {
      screen: ChatStack,
      navigationOptions: ({navigation}) => {
        let last = navigation.state.routes.length - 1;
        let visible = navigation.state.routes[last].routeName !== 'ChatRoom';
        return {
          tabBarVisible: visible,
          title: I18n.t('placeholder.chat'),
          tabBarLabel: I18n.t('placeholder.chat'),
          tabBarColor: '#09A650',
          tabBarIcon: () => <MatIcon size={26} name="chat" color="#FFF" />,
        };
      },
      // navigationOptions: {
      //   title: I18n.t('placeholder.chat'),
      //   tabBarLabel: I18n.t('placeholder.chat'),
      //   tabBarColor: '#09A650',
      //   tabBarIcon: () => <MatIcon size={26} name="chat" color="#FFF" />,
      // },
    },
    Notification: {
      screen: NotificationView,
      navigationOptions: {
        title: I18n.t('placeholder.notifications'),
        tabBarLabel: I18n.t('placeholder.notifications'),
        tabBarColor: '#F93636',
        tabBarIcon: () => (
          <MatIcon size={26} name="notifications" color="#FFF" />
        ),
      },
    },
    Profile: {
      screen: ProfileStack,
      navigationOptions: {
        title: I18n.t('placeholder.profile'),
        tabBarLabel: I18n.t('placeholder.profile'),
        tabBarColor: '#6D06F9',
        tabBarIcon: () => <MatIcon size={26} name="account-box" color="#FFF" />,
      },
    },
  },
  {
    initialRouteName: 'Home',
    activeColor: '#f0edf6',
    inactiveColor: '#3e2465',
    barStyle: {backgroundColor: '#2370E6'},
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
    initialRouteName: 'Logo',
  },
);

const Navigator = createAppContainer(AppNavigator);

export default Navigator;

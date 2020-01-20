import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import {createMaterialBottomTabNavigator} from 'react-navigation-material-bottom-tabs';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import I18n from '../../components/i18n';
import AsyncStorage from '@react-native-community/async-storage';
import {Badge} from 'react-native-elements';

// View
import HomeView from '../home/homeView';
import ChatListView from '../chat/chatListView';
import ChatView from '../chat/chatView';
import NotificationView from '../notification/notificationView';
import ProfileView from '../profile/profileView';
import LoginView from '../auth/login/loginView';
import RegisterView from '../auth/register/registerView';
import ForgotPasswordView from '../auth/forgotPassword/forgotPasswordView';
import LogoView from '../logo/logoView';
import GroupView from '../home/group/groupView';

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
      navigationOptions: ({navigation, screenProps, theme}) => {
        let {appColor} = screenProps;
        return {
          tabBarLabel: (
            <Text
              style={{textAlign: 'center', flex: 1, fontFamily: 'Kanit-Light'}}>
              {I18n.t('placeholder.home')}
            </Text>
          ),
          tabBarColor: appColor,
          tabBarIcon: active => {
            return (
              <MatIcon
                size={26}
                name="home"
                color={active.focused ? '#3FFC89' : '#D6D6D6'}
              />
            );
          },
        };
      },
    },
    Chat: {
      screen: ChatStack,
      navigationOptions: ({navigation, screenProps, theme}) => {
        let {appColor} = screenProps;
        let {unreadMessagesCount} = screenProps;
        let last = navigation.state.routes.length - 1;
        let visible = navigation.state.routes[last].routeName !== 'ChatRoom';

        return {
          tabBarBadge: unreadMessagesCount || false,
          tabBarVisible: visible,
          tabBarLabel: (
            <Text
              style={{textAlign: 'center', flex: 1, fontFamily: 'Kanit-Light'}}>
              {I18n.t('placeholder.chat')}
            </Text>
          ),
          tabBarColor: appColor,
          tabBarIcon: active => {
            isActive = active.focused;
            return (
              <MatIcon
                size={26}
                name="chat"
                color={active.focused ? '#3FFC89' : '#D6D6D6'}
              />
            );
          },
        };
      },
    },
    Notification: {
      screen: NotificationView,
      navigationOptions: ({navigation, screenProps, theme}) => {
        let {appColor} = screenProps;
        let {unreadNotificationsCount} = screenProps;
        return {
          tabBarBadge: unreadNotificationsCount || false,
          tabBarLabel: (
            <Text
              style={{textAlign: 'center', flex: 1, fontFamily: 'Kanit-Light'}}>
              {I18n.t('placeholder.notifications')}
            </Text>
          ),
          tabBarColor: appColor,
          tabBarIcon: active => {
            return (
              <MatIcon
                size={26}
                name="notifications"
                color={active.focused ? '#3FFC89' : '#D6D6D6'}
              />
            );
          },
        };
      },
    },
    Profile: {
      screen: ProfileStack,
      navigationOptions: ({navigation, screenProps, theme}) => {
        let {appColor} = screenProps;
        return {
          tabBarLabel: (
            <Text
              style={{textAlign: 'center', flex: 1, fontFamily: 'Kanit-Light'}}>
              {I18n.t('placeholder.profile')}
            </Text>
          ),
          tabBarColor: appColor,
          tabBarIcon: active => {
            return (
              <MatIcon
                size={26}
                name="account-box"
                color={active.focused ? '#3FFC89' : '#D6D6D6'}
              />
            );
          },
        };
      },
    },
  },
  {
    initialRouteName: 'Home',
    activeColor: '#2370E6',
    inactiveColor: '#202020',
    barStyle: {backgroundColor: '#202020'},
    labeled: false,
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

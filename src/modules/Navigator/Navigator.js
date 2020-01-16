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
import EditProfileView from '../Profile/EditProfileView';

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
    EditProfile: {screen: EditProfileView},
  },
  {
    headerMode: 'none',
  },
);

const MainNavigator = createMaterialBottomTabNavigator(
  {
    Home: {
      screen: HomeStack,
      navigationOptions: ({navigation, screenProps}) => {
        return {
          tabBarLabel: (
            <Text
              style={{textAlign: 'center', flex: 1, fontFamily: 'Kanit-Light'}}>
              {I18n.t('placeholder.home')}
            </Text>
          ),
          tabBarColor: '#2370E6',
          tabBarIcon: active => {
            return (
              <MatIcon
                size={26}
                name="home"
                color={active.focused ? '#FFF' : '#D6D6D6'}
              />
            );
          },
        };
      },
    },
    Chat: {
      screen: ChatStack,
      navigationOptions: ({navigation, screenProps}) => {
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
          tabBarColor: '#09A650',
          tabBarIcon: active => {
            isActive = active.focused;
            return (
              <MatIcon
                size={26}
                name="chat"
                color={active.focused ? '#FFF' : '#D6D6D6'}
              />
            );
          },
        };
      },
    },
    Notification: {
      screen: NotificationView,
      navigationOptions: ({navigation, screenProps}) => {
        let {unreadNotificationsCount} = screenProps;
        return {
          tabBarBadge: unreadNotificationsCount || false,
          tabBarLabel: (
            <Text
              style={{textAlign: 'center', flex: 1, fontFamily: 'Kanit-Light'}}>
              {I18n.t('placeholder.notifications')}
            </Text>
          ),
          tabBarColor: '#F93636',
          tabBarIcon: active => {
            return (
              <MatIcon
                size={26}
                name="notifications"
                color={active.focused ? '#FFF' : '#D6D6D6'}
              />
            );
          },
        };
      },
    },
    Profile: {
      screen: ProfileStack,
      navigationOptions: {
        tabBarLabel: (
          <Text
            style={{textAlign: 'center', flex: 1, fontFamily: 'Kanit-Light'}}>
            {I18n.t('placeholder.profile')}
          </Text>
        ),
        tabBarColor: '#6D06F9',
        tabBarIcon: active => {
          return (
            <MatIcon
              size={26}
              name="account-box"
              color={active.focused ? '#FFF' : '#D6D6D6'}
            />
          );
        },
      },
    },
  },
  {
    initialRouteName: 'Home',
    activeColor: '#f0edf6',
    inactiveColor: '#3e2465',
    barStyle: {backgroundColor: '#2370E6'},
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

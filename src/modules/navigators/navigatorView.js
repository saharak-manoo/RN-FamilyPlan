import React, {Component} from 'react';
import firebase from 'react-native-firebase';

// View
import NavigatorStack from './navigator';

export default class NavigatorView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      unreadMessagesCount: 4,
      unreadNotificationsCount: 28,
    };
  }

  render() {
    return (
      <NavigatorStack
        screenProps={{unreadMessagesCount: 8, unreadNotificationsCount: 28}}
      />
    );
  }
}

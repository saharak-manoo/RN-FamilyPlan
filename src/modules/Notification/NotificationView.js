import React, {Component} from 'react';
import {
  Alert,
  FlatList,
  Platform,
  StatusBar,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';
import {Appbar, Text, Searchbar} from 'react-native-paper';
import I18n from '../../components/i18n';
import {styles} from '../../components/styles';
import {Badge, ListItem, Icon} from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import Swipeout from 'react-native-swipeout';
import * as Api from '../../util/Api';
import * as GFunction from '../../util/GlobalFunction';
import Spinner from 'react-native-loading-spinner-overlay';
import firebase from 'react-native-firebase';

const IS_IOS = Platform.OS === 'ios';

export default class NotificationView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
      refreshing: false,
      page: 1,
      limit: 50,
      offset: 0,
      notifications: [],
    };
  }

  AppHerder() {
    return (
      <View>
        <Appbar.Header style={{backgroundColor: '#F93636'}}>
          <Appbar.Content
            title={I18n.t('placeholder.notifications')}
            titleStyle={{fontFamily: 'Kanit-Light'}}
          />
        </Appbar.Header>
      </View>
    );
  }

  componentWillMount = async () => {
    this.setState({spinner: true});
    let user = await GFunction.user();
    let params = {
      limit: this.state.limit,
      offset: this.state.offset,
    };
    let resp = await Api.getNotification(user.authentication_jwt, params);
    if (resp.success) {
      this.setState({
        spinner: false,
        notifications: resp.notifications,
      });
    }
  };

  realTimeData(data) {
    if (data.noti_type === 'group') {
      let group_noti_id = JSON.parse(data.group_noti_id);
      alert(group_noti_id);
      let index = this.state.notifications.findIndex(
        n => n.id === group_noti_id,
      );
    }
  }

  componentDidMount() {
    this.messageListener = firebase.messaging().onMessage(message => {
      this.realTimeData(message._data);
    });

    this.notificationDisplayedListener = firebase
      .notifications()
      .onNotificationDisplayed(notification => {});

    this.notificationListener = firebase
      .notifications()
      .onNotification(notification => {
        this.realTimeData(notification._data);
      });
  }

  componentWillUnmount() {
    this.notificationDisplayedListener();
    this.notificationListener();
  }

  goTo = notification => {
    if (
      notification.noti_type === 'chat' ||
      notification.noti_type.includes('request_join-')
    ) {
      this.props.navigation.navigate('ChatRoom', {
        chatRoom: notification.data,
        isRequestJoin: false,
      });
    } else if (notification.noti_type === 'group') {
      this.props.navigation.navigate('Group', {
        group: notification.data,
      });
    }
  };

  listNotification = notifications => {
    return (
      <FlatList
        style={{flex: 1}}
        data={notifications}
        renderItem={({item, index}) => {
          return (
            <Swipeout
              style={{fontFamily: 'Kanit-Light'}}
              autoClose={true}
              right={[
                {
                  text: 'Delete',
                  type: 'delete',
                  onPress: () => {
                    this.alertRemoveChatMember(item.id, index);
                  },
                },
              ]}
              style={{backgroundColor: '#FFF'}}>
              <ListItem
                key={index}
                Component={TouchableScale}
                friction={90}
                tension={100}
                activeScale={0.95}
                leftAvatar={{
                  title: item.name[0],
                  activeOpacity: 0.2,
                }}
                title={item.name}
                titleStyle={{fontFamily: 'Kanit-Light'}}
                subtitle={item.message}
                subtitleStyle={{fontFamily: 'Kanit-Light'}}
                containerStyle={{
                  backgroundColor: index == 0 ? '#D4FDE8' : '#FFF',
                }}
                rightSubtitle={item.time}
                rightSubtitleStyle={{fontFamily: 'Kanit-Light'}}
                onPress={() => this.goTo(item)}
              />
            </Swipeout>
          );
        }}
        keyExtractor={item => item}
      />
    );
  };

  alertRemoveNotification(id, index) {
    Alert.alert(
      '',
      'Are your sure tou want to delete this chat ?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => this.removeChatNotification(id, index),
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
  }

  async removeChatNotification(id, index) {
    this.state.notifications.splice(index, 1);
    await this.setState({group: this.state.notifications});
    GFunction.successMessage(
      I18n.t('message.success'),
      I18n.t('message.removeChatSuccessful'),
    );
  }

  refreshNotification = async () => {
    await this.setState({refreshing: true});
    let user = await GFunction.user();
    let params = {
      limit: this.state.limit,
      offset: this.state.offset,
    };
    let resp = await Api.getNotification(user.authentication_jwt, params);
    if (resp.success) {
      await this.setState({
        refreshing: false,
        notifications: resp.notifications,
      });
    }
  };

  // loadMoreNotifications = async () => {
  //   let user = await GFunction.user();
  //   let params = {
  //     limit: this.state.limit,
  //     offset: this.state.offset,
  //   };
  //   let resp = await Api.getNotification(user.authentication_jwt, params);
  //   console.log(resp.notifications);
  //   if (resp.success) {
  //     await this.setState({
  //       notifications: this.state.notifications.push(resp.notifications),
  //     });
  //   }
  // };

  isToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 250;
    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };

  render() {
    return (
      <View style={styles.defaultView}>
        {this.AppHerder()}
        {this.state.spinner ? (
          <Spinner
            visible={this.state.spinner}
            textContent={`${I18n.t('placeholder.loading')}...`}
            textStyle={styles.spinnerTextStyle}
          />
        ) : (
          <ScrollView
            style={{flex: 1}}
            refreshControl={
              <RefreshControl
                refreshing={this.state.refreshing}
                onRefresh={this.refreshNotification}
              />
            }>
            {this.listNotification(this.state.notifications)}
          </ScrollView>
        )}
      </View>
    );
  }
}

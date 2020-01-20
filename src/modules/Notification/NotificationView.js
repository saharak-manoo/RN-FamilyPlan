import React, {Component} from 'react';
import {
  Alert,
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  StatusBar,
  RefreshControl,
  ScrollView,
  View,
} from 'react-native';
import {connect} from 'react-redux';
import {setDarkMode, setLanguage} from '../actions';
import AsyncStorage from '@react-native-community/async-storage';
import {Appbar, Text, Searchbar} from 'react-native-paper';
import I18n from '../../components/i18n';
import {styles} from '../../components/styles';
import {Badge, ListItem, Icon} from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import Swipeout from 'react-native-swipeout';
import * as Api from '../actions/api';
import * as GFun from '../../helpers/globalFunction';
import Spinner from 'react-native-loading-spinner-overlay';
import firebase from 'react-native-firebase';
import UserAvatar from 'react-native-user-avatar';
import ContentLoader from 'react-native-content-loader';
import {Circle, Rect} from 'react-native-svg';

const IS_IOS = Platform.OS === 'ios';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

class NotificationView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isDarkMode: this.props.setting.isDarkMode,
      spinner: false,
      refreshing: false,
      isLoading: false,
      limit: 20,
      offset: 0,
      notifications: [],
    };
  }

  AppHerder() {
    return (
      <View>
        <Appbar.Header style={{backgroundColor: this.props.setting.appColor}}>
          <Appbar.Content
            title={I18n.t('placeholder.notifications')}
            titleStyle={{fontFamily: 'Kanit-Light'}}
          />
        </Appbar.Header>
      </View>
    );
  }

  componentWillMount = async () => {
    this.triggerTurnOnNotification();
    this.setState({spinner: true});
    let user = await GFun.user();
    let params = {
      limit: this.state.limit,
      offset: this.state.offset,
    };
    let resp = await Api.getNotification(user.authentication_jwt, params);
    if (resp.success) {
      this.setState({
        spinner: false,
        notifications: GFun.sortByDate(resp.notifications),
      });
    }
  };

  async triggerTurnOnNotification() {
    this.notificationListener = firebase
      .notifications()
      .onNotification(async notification => {
        this.realTimeData(notification._data);
      });
  }

  async realTimeData(data) {
    if (
      data.noti_type === 'group' ||
      data.noti_type.includes('request_join-')
    ) {
      let group_noti_id = JSON.parse(data.group_noti_id);
      let user = await GFun.user();
      let resp = await Api.getNotificationById(
        user.authentication_jwt,
        group_noti_id,
      );
      if (resp.success) {
        let notiIndex = this.state.notifications.findIndex(
          noti => noti.id === group_noti_id,
        );

        if (notiIndex === -1) {
          this.setState({
            notifications: GFun.sortByDate(
              GFun.uniq(resp.notification.concat(this.state.notifications)),
            ),
          });
        }
      }
    }
  }

  componentDidMount() {
    this.messageListener = firebase.messaging().onMessage(message => {
      this.realTimeData(message._data);
    });
  }

  componentWillUnmount() {
    this.messageListener();
    this.notificationListener();
  }

  goTo = notification => {
    if (
      notification.noti_type === 'chat' ||
      notification.noti_type.includes('request_join-')
    ) {
      this.props.navigation.navigate('ChatRoom', {
        isDarkMode: this.state.isDarkMode,
        chatRoom: notification.data,
        isRequestJoin: false,
      });
    } else if (notification.noti_type === 'group') {
      this.props.navigation.navigate('Group', {
        isDarkMode: this.state.isDarkMode,
        group: notification.data,
      });
    }
  };

  listNotification = notifications => {
    return (
      <FlatList
        style={{
          flex: 1,
        }}
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
                    this.alertRemoveNotification(item.id, index);
                  },
                },
              ]}
              style={{
                backgroundColor: this.state.isDarkMode ? '#202020' : '#FFF',
              }}>
              <ListItem
                key={index}
                Component={TouchableScale}
                containerStyle={{
                  backgroundColor: this.state.isDarkMode ? '#202020' : '#FFF',
                  color: this.state.isDarkMode ? '#FFF' : '#000',
                }}
                friction={90}
                tension={100}
                activeScale={0.95}
                leftAvatar={() => <UserAvatar size="40" name={item.name} />}
                title={item.name}
                titleStyle={{
                  fontFamily: 'Kanit-Light',
                  color: this.state.isDarkMode ? '#FFF' : '#000',
                }}
                subtitle={item.message}
                subtitleStyle={{
                  fontFamily: 'Kanit-Light',
                  color: this.state.isDarkMode ? '#FFF' : '#000',
                }}
                rightSubtitle={item.time}
                rightSubtitleStyle={{
                  fontFamily: 'Kanit-Light',
                  color: this.state.isDarkMode ? '#FFF' : '#000',
                }}
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
      'Are your sure tou want to delete this notifications ?',
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
    await this.setState({notifications: this.state.notifications});
    GFun.successMessage(
      I18n.t('message.success'),
      I18n.t('message.removeNotiSuccessful'),
    );
  }

  refreshNotification = async () => {
    await this.setState({refreshing: true});
    let user = await GFun.user();
    let params = {
      limit: this.state.limit,
      offset: this.state.offset,
    };
    let resp = await Api.getNotification(user.authentication_jwt, params);
    if (resp.success) {
      await this.setState({
        refreshing: false,
        notifications: GFun.sortByDate(resp.notifications),
      });
    }
  };

  isToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    // let paddingToBottom = 80;
    // let isLoading =
    //   layoutMeasurement.height + contentOffset.y >=
    //   contentSize.height - paddingToBottom;
    // if (isLoading && !this.state.refreshing) {
    //   this.setState({isLoading: isLoading});
    //   this.loadMoreNotifications();
    // }
  };

  loadEarlier() {
    return (
      <View style={{padding: 20}}>
        <ActivityIndicator size="small"></ActivityIndicator>
      </View>
    );
  }

  loadMoreNotifications = async () => {
    let user = await GFun.user();
    let params = {
      limit: this.state.limit,
      offset: this.state.notifications.length,
    };

    let resp = await Api.getNotification(user.authentication_jwt, params);
    if (resp.success) {
      await this.setState({
        notifications: GFun.sortByDate(
          this.state.notifications.concat(resp.notifications),
        ),
        isLoading: false,
      });
    }
  };

  renderLoadingNotification() {
    return (
      <FlatList
        style={{flex: 1}}
        data={Array(10)
          .fill(null)
          .map((x, i) => i)}
        scrollEnabled={!this.state.spinner}
        renderItem={() => {
          return (
            <ListItem
              Component={TouchableScale}
              containerStyle={{
                backgroundColor: this.state.isDarkMode ? '#202020' : '#FFF',
              }}
              friction={90}
              tension={100}
              activeScale={0.95}
              leftAvatar={() => (
                <ContentLoader
                  height={45}
                  width={50}
                  primaryColor={this.state.isDarkMode ? '#333' : '#f3f3f3'}
                  secondaryColor={
                    this.state.isDarkMode ? '#202020' : '#ecebeb'
                  }>
                  <Circle r={18} x={22} y={25} />
                </ContentLoader>
              )}
              title={() => (
                <ContentLoader
                  height={30}
                  width={width / 2}
                  primaryColor={this.state.isDarkMode ? '#333' : '#f3f3f3'}
                  secondaryColor={
                    this.state.isDarkMode ? '#202020' : '#ecebeb'
                  }>
                  <Rect x="5" y="5" width={width / 1} height={10} />
                </ContentLoader>
              )}
              subtitle={() => (
                <ContentLoader
                  height={20}
                  width={width / 1.8}
                  primaryColor={this.state.isDarkMode ? '#333' : '#f3f3f3'}
                  secondaryColor={
                    this.state.isDarkMode ? '#202020' : '#ecebeb'
                  }>
                  <Rect x="5" y="5" width={width / 1.8} height={5} />
                  <Rect x="5" y="15" width={width / 1.8} height={5} />
                  <Rect x="5" y="30" width={width / 1.8} height={5} />
                </ContentLoader>
              )}
              rightSubtitle={() => (
                <ContentLoader
                  height={20}
                  width={width / 5}
                  primaryColor={this.state.isDarkMode ? '#333' : '#f3f3f3'}
                  secondaryColor={
                    this.state.isDarkMode ? '#202020' : '#ecebeb'
                  }>
                  <Rect x="40" y="10" width={width / 5} height={15} />
                </ContentLoader>
              )}
            />
          );
        }}
        keyExtractor={item => item}
      />
    );
  }

  render() {
    return (
      <View
        style={[
          styles.defaultView,
          {backgroundColor: this.state.isDarkMode ? '#202020' : '#EEEEEE'},
        ]}>
        {this.AppHerder()}
        {this.state.spinner ? (
          this.renderLoadingNotification()
        ) : (
          <ScrollView
            onScroll={({nativeEvent}) => {
              this.isToBottom(nativeEvent);
            }}
            style={{flex: 1}}
            refreshControl={
              <RefreshControl
                tintColor={this.state.isDarkMode ? '#FFF' : '#000'}
                refreshing={this.state.refreshing}
                onRefresh={this.refreshNotification}
              />
            }>
            {this.listNotification(this.state.notifications)}
            {this.state.isLoading && !this.state.refreshing
              ? this.loadEarlier()
              : null}
          </ScrollView>
        )}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  screenBadge: state.screenBadge,
  setting: state.setting,
});

const mapDispatchToProps = {
  setDarkMode,
  setLanguage,
};

export default connect(mapStateToProps, mapDispatchToProps)(NotificationView);

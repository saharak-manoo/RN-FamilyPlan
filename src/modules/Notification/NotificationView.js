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
import {Appbar, Text, Searchbar} from 'react-native-paper';
import I18n from '../../components/i18n';
import {styles} from '../../components/styles';
import {Badge, ListItem, Icon} from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import Swipeout from 'react-native-swipeout';
import * as Api from '../../util/Api';
import * as GFun from '../../util/GlobalFunction';
import Spinner from 'react-native-loading-spinner-overlay';
import firebase from 'react-native-firebase';
import UserAvatar from 'react-native-user-avatar';
import ContentLoader from 'react-native-content-loader';
import {Circle, Rect} from 'react-native-svg';

const IS_IOS = Platform.OS === 'ios';
const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class NotificationView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
      refreshing: false,
      isLoading: false,
      limit: 150,
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

  async realTimeData(data) {
    if (
      data.noti_type === 'group' ||
      data.noti_type.includes('request_join-')
    ) {
      if (!data.group_noti_id) {
        let group_noti_id = JSON.parse(data.group_noti_id);
        let user = await GFun.user();
        let resp = await Api.getNotificationById(
          user.authentication_jwt,
          group_noti_id,
        );
        if (resp.success) {
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
                leftAvatar={() => <UserAvatar size="40" name={item.name} />}
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
    GFun.successMessage(
      I18n.t('message.success'),
      I18n.t('message.removeChatSuccessful'),
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
            <ContentLoader height={height / 12} width={width / 1}>
              <Circle cx={36} cy={36} r={20} x={14} />
              <Rect
                x={10}
                y={0}
                rx={20}
                ry={20}
                width={width / 1.06}
                height={height / 13}
              />
              <Rect x="90" y="15" width={width / 1.5} height={15} />
              <Rect x="90" y="50" width={width / 2} height={10} />
            </ContentLoader>
          );
        }}
        keyExtractor={item => item}
      />
    );
  }

  render() {
    return (
      <View style={styles.defaultView}>
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

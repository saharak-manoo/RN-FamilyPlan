import React, {Component} from 'react';
import {
  Alert,
  ActivityIndicator,
  Dimensions,
  FlatList,
  Platform,
  StatusBar,
  View,
  ScrollView,
  RefreshControl,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
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

export default class ChatListView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      isDarkMode: false,
      user: [],
      spinner: false,
      search: '',
      refreshing: false,
      chatRooms: [],
      isLoading: false,
      limit: 15,
      offset: 0,
    };
  }

  AppHerder() {
    return (
      <View>
        <Appbar.Header style={{backgroundColor: '#09A650'}}>
          <Appbar.Content
            title={I18n.t('placeholder.chat')}
            titleStyle={{fontFamily: 'Kanit-Light'}}
          />
        </Appbar.Header>
      </View>
    );
  }

  componentWillMount = async () => {
    this.triggerTurnOnNotification();
    let isDarkMode = await AsyncStorage.getItem('isDarkMode');
    this.setState({spinner: true, isDarkMode: JSON.parse(isDarkMode)});
    let user = await GFun.user();
    let params = {
      limit: this.state.limit,
      offset: this.state.offset,
    };
    await this.setState({user: user});
    let resp = await Api.getChatRoom(
      this.state.user.authentication_jwt,
      params,
    );
    if (resp.success) {
      this.setState({
        spinner: false,
        chatRooms: GFun.sortByDate(resp.chat_rooms),
        tempChatRooms: GFun.sortByDate(resp.chat_rooms),
      });
    }
  };

  async realTimeData(data) {
    if (data.noti_type === 'chat' || data.noti_type.includes('request_join-')) {
      let chatRoom = JSON.parse(data.chat_room);
      let chatRoomIndex = this.state.chatRooms.findIndex(
        c => c.id === chatRoom.id,
      );

      if (chatRoomIndex === -1) {
        this.setState({
          chatRooms: GFun.sortByDate([chatRoom].concat(this.state.chatRooms)),
          tempChatRooms: GFun.sortByDate(
            [chatRoom].concat(this.state.chatRooms),
          ),
        });
      } else {
        this.state.chatRooms[chatRoomIndex] = chatRoom;
        this.setState({
          chatRooms: GFun.sortByDate(this.state.chatRooms),
          tempChatRooms: GFun.sortByDate(this.state.chatRooms),
        });
      }
    } else if (data.noti_type === 'group') {
      let group = JSON.parse(data.group);

      let isNotStayGroup =
        group.members.filter(m => m.id === this.state.user.id).length === 0;
      if (isNotStayGroup) {
        GFun.errorMessage(group.name, I18n.t('message.removedFromTheGroup'));
        let chatRoomIndex = this.state.chatRooms.findIndex(
          c => c.group.id === group.id && c.group.name === group.name,
        );

        if (chatRoomIndex !== -1) {
          this.state.chatRooms.splice(chatRoomIndex, 1);
          await this.setState({chatRooms: this.state.chatRooms});
        }
      }
    }
  }

  async triggerTurnOnNotification() {
    this.notificationListener = firebase
      .notifications()
      .onNotification(async notification => {
        this.realTimeData(notification._data);
      });
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

  refreshChatRoom = async () => {
    await this.setState({refreshing: true});
    let resp = await Api.getChatRoom(this.state.user.authentication_jwt);
    if (resp.success) {
      await this.setState({
        chatRooms: GFun.sortByDate(resp.chat_rooms),
        tempChatRooms: GFun.sortByDate(resp.chat_rooms),
        refreshing: false,
      });
    }
  };

  listChatRoom = chats => {
    return (
      <FlatList
        style={{flex: 1}}
        data={chats}
        renderItem={({item, index}) => {
          return (
            <Swipeout
              autoClose={true}
              right={[
                {
                  text: 'Delete',
                  type: 'delete',
                  onPress: () => {
                    this.alertRemoveChatRoom(item.id, index);
                  },
                },
              ]}
              style={{
                backgroundColor: this.state.isDarkMode ? '#202020' : '#FFF',
                fontFamily: 'Kanit-Light',
              }}>
              <ListItem
                key={index}
                containerStyle={{
                  backgroundColor: this.state.isDarkMode ? '#202020' : '#FFF',
                }}
                Component={TouchableScale}
                friction={90}
                tension={100}
                activeScale={0.95}
                leftAvatar={() => <UserAvatar size="40" name={item.name} />}
                title={item.name}
                titleStyle={{
                  fontFamily: 'Kanit-Light',
                  color: this.state.isDarkMode ? '#FFF' : '#000',
                }}
                subtitle={item.last_messags}
                subtitleStyle={{
                  fontFamily: 'Kanit-Light',
                  color: this.state.isDarkMode ? '#FFF' : '#000',
                }}
                onPress={() => this.goToChatRoom(item)}
                rightSubtitle={item.last_messags_time}
                rightSubtitleStyle={{
                  fontFamily: 'Kanit-Light',
                  color: this.state.isDarkMode ? '#FFF' : '#000',
                }}
              />
            </Swipeout>
          );
        }}
        keyExtractor={item => item}
      />
    );
  };

  alertRemoveChatRoom(id, index) {
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
          onPress: () => this.removeChat(id, index),
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
  }

  async removeChat(id, index) {
    this.state.chatRooms.splice(index, 1);
    await this.setState({chatRooms: this.state.chatRooms});
    GFun.successMessage(
      I18n.t('message.success'),
      I18n.t('message.removeChatSuccessful'),
    );
  }

  goToChatRoom(chatRoom) {
    this.props.navigation.navigate('ChatRoom', {
      isDarkMode: this.state.isDarkMode,
      chatRoom: chatRoom,
      isRequestJoin: false,
    });
  }

  async searchChatRoom(search) {
    await this.setState({
      search: search,
      chatRooms: this.state.tempChatRooms,
    });
    if (search !== '') {
      search = search.toLowerCase();
      let chatRooms = this.state.chatRooms;
      if (chatRooms !== undefined) {
        chatRooms = chatRooms.filter(
          chatRoom =>
            chatRoom.name.toLowerCase().includes(search) ||
            chatRoom.last_messags.toLowerCase().includes(search) ||
            chatRoom.last_messags.toLowerCase().includes(search),
        );

        await this.setState({chatRooms: chatRooms});
      }
    }
  }

  isToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    let paddingToBottom = 80;
    let isLoading =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;

    if (isLoading && !this.state.refreshing) {
      this.setState({isLoading: isLoading});
      this.loadMoreChatRooms();
    }
  };

  loadEarlier() {
    return (
      <View style={{padding: 20}}>
        <ActivityIndicator size="small"></ActivityIndicator>
      </View>
    );
  }

  loadMoreChatRooms = async () => {
    let user = await GFun.user();
    let params = {
      limit: this.state.limit,
      offset: this.state.chatRooms.length,
    };

    let resp = await Api.getChatRoom(user.authentication_jwt, params);
    if (resp.success) {
      await this.setState({
        chatRooms: GFun.sortByDate(
          this.state.chatRooms.concat(resp.chat_rooms),
        ),
        isLoading: false,
      });
    }
  };

  renderLoadingChatRoom() {
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
              containerStyle={{
                backgroundColor: this.state.isDarkMode ? '#202020' : '#FFF',
              }}
              Component={TouchableScale}
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
                  <Rect x="5" y="10" width={width / 1} height={15} />
                </ContentLoader>
              )}
              titleStyle={{fontFamily: 'Kanit-Light'}}
              subtitle={() => (
                <ContentLoader
                  height={20}
                  width={width / 1.8}
                  primaryColor={this.state.isDarkMode ? '#333' : '#f3f3f3'}
                  secondaryColor={
                    this.state.isDarkMode ? '#202020' : '#ecebeb'
                  }>
                  <Rect x="5" y="10" width={width / 1.8} height={9} />
                </ContentLoader>
              )}
              subtitleStyle={{fontFamily: 'Kanit-Light'}}
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
              rightSubtitleStyle={{fontFamily: 'Kanit-Light'}}
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
          styles.chatView,
          {backgroundColor: this.state.isDarkMode ? '#202020' : '#FFF'},
        ]}>
        {this.AppHerder()}
        <View style={{padding: 15}}>
          <Searchbar
            style={{
              backgroundColor: this.state.isDarkMode ? '#363636' : '#FFF',
            }}
            inputStyle={{
              fontFamily: 'Kanit-Light',
              backgroundColor: this.state.isDarkMode ? '#363636' : '#FFF',
            }}
            placeholder={I18n.t('placeholder.search')}
            onChangeText={searching => {
              this.searchChatRoom(searching);
            }}
            value={this.state.search}
          />
        </View>
        {this.state.spinner ? (
          this.renderLoadingChatRoom()
        ) : (
          <ScrollView
            refreshControl={
              <RefreshControl
                tintColor={this.state.isDarkMode ? '#FFF' : '#000'}
                refreshing={this.state.refreshing}
                onRefresh={this.refreshChatRoom}
              />
            }>
            <View style={{flex: 1}}>
              {this.listChatRoom(this.state.chatRooms)}
              {this.state.isLoading && !this.state.refreshing
                ? this.loadEarlier()
                : null}
            </View>
          </ScrollView>
        )}
      </View>
    );
  }
}

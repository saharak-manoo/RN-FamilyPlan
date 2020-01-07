import React, {Component} from 'react';
import {
  Alert,
  ActivityIndicator,
  FlatList,
  Platform,
  StatusBar,
  View,
  ScrollView,
  RefreshControl,
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

const IS_IOS = Platform.OS === 'ios';

export default class ChatListView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
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
    this.setState({spinner: true});
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

  realTimeData(data) {
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
    }
  }

  componentDidMount() {
    this.messageListener = firebase.messaging().onMessage(message => {
      this.realTimeData(message._data);
    });
  }

  refreshChatRoom = async () => {
    await this.setState({refreshing: true});
    let resp = await Api.getChatRoom(this.state.user.authentication_jwt);
    if (resp.success) {
      await this.setState({
        chatRooms: resp.chat_rooms,
        tempChatRooms: resp.chat_rooms,
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
                    this.alertRemoveChatMember(item.id, index);
                  },
                },
              ]}
              style={{
                backgroundColor: '#FFF',
                fontFamily: 'Kanit-Light',
              }}>
              <ListItem
                key={index}
                Component={TouchableScale}
                friction={90}
                tension={100}
                activeScale={0.95}
                leftAvatar={() => <UserAvatar size="40" name={item.name} />}
                title={item.name}
                titleStyle={{fontFamily: 'Kanit-Light'}}
                subtitle={item.last_messags}
                subtitleStyle={{fontFamily: 'Kanit-Light'}}
                onPress={() => this.goToChatRoom(item)}
                rightSubtitle={item.last_messags_time}
                rightSubtitleStyle={{fontFamily: 'Kanit-Light'}}
              />
            </Swipeout>
          );
        }}
        keyExtractor={item => item}
      />
    );
  };

  alertRemoveChatMember(id, index) {
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
          onPress: () => this.state(id, index),
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
  }

  async removeChat(id, index) {
    this.state.chatRooms.splice(index, 1);
    await this.setState({chatRooms: this.state.chat_rooms});
    GFun.successMessage(
      I18n.t('message.success'),
      I18n.t('message.removeChatSuccessful'),
    );
  }

  goToChatRoom(chatRoom) {
    this.props.navigation.navigate('ChatRoom', {
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

  render() {
    return (
      <View style={styles.chatView}>
        {this.AppHerder()}
        <View style={{padding: 15}}>
          <Searchbar
            theme={{
              colors: {
                placeholder: '#6D6D6D',
                text: '#000',
                primary: '#000',
                underlineColor: '#6D6D6D',
              },
              fonts: {regular: 'Kanit-Light'},
            }}
            inputStyle={{fontFamily: 'Kanit-Light'}}
            placeholder={I18n.t('placeholder.search')}
            onChangeText={searching => {
              this.searchChatRoom(searching);
            }}
            value={this.state.search}
          />
        </View>
        {this.state.spinner ? (
          <Spinner
            visible={this.state.spinner}
            textContent={`${I18n.t('placeholder.loading')}...`}
            textStyle={styles.spinnerTextStyle}
          />
        ) : (
          <ScrollView
            onScroll={({nativeEvent}) => {
              this.isToBottom(nativeEvent);
            }}
            refreshControl={
              <RefreshControl
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

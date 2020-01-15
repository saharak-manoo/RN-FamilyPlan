import React, {Component} from 'react';
import {
  Alert,
  ActivityIndicator,
  FlatList,
  Platform,
  StatusBar,
  TouchableOpacity,
  View,
  TextInput,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {Appbar, Text, Searchbar} from 'react-native-paper';
import I18n from '../../components/i18n';
import {styles} from '../../components/styles';
import * as Api from '../../util/Api';
import * as GFun from '../../util/GlobalFunction';
import {GiftedChat, Bubble, Composer} from 'react-native-gifted-chat';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import Spinner from 'react-native-loading-spinner-overlay';
import firebase from 'react-native-firebase';
import QuickReplies from 'react-native-gifted-chat/lib/QuickReplies';

const IS_IOS = Platform.OS === 'ios';
export default class ChatView extends Component<Props> {
  constructor(props) {
    super(props);
    let params = this.props.navigation.state.params;
    let chatRoom = this.props.navigation.state.params.chatRoom;
    this.state = {
      isDarkMode: params.isDarkMode || false,
      user: [],
      spinner: false,
      chatRoom: chatRoom,
      messages: chatRoom.messages,
      search: '',
      text: '',
      isReadySend: false,
      isLoading: false,
      limit: 15,
      offset: 0,
    };
  }

  AppHerder() {
    return (
      <View>
        <Appbar.Header
          style={{
            backgroundColor: this.state.chatRoom.group.color,
          }}>
          <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content
            title={this.state.chatRoom.name}
            titleStyle={{fontFamily: 'Kanit-Light'}}
          />
        </Appbar.Header>
      </View>
    );
  }

  async componentWillMount() {
    this.triggerTurnOnNotification();
    // get user
    let user = await GFun.user();
    await this.setState({
      user: user,
      messages: this.state.chatRoom.messages,
    });
  }

  realTimeData(data) {
    if (data.noti_type === 'chat' || data.noti_type.includes('request_join-')) {
      let message = JSON.parse(data.message);
      if (this.state.user.id !== message.user._id) {
        let messageIndex = this.state.messages.findIndex(
          m => m._id === message._id,
        );

        if (messageIndex === -1) {
          this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, message),
          }));
        }
      }
    } else if (data.noti_type === 'group') {
      let group = JSON.parse(data.group);

      let isNotStayGroup =
        group.members.filter(m => m.id === this.state.user.id).length === 0;
      if (isNotStayGroup) {
        GFun.errorMessage(group.name, I18n.t('message.removedFromTheGroup'));
        this.props.navigation.navigate('ChatList', {
          isDarkMode: this.state.isDarkMode,
        });
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

  dialogAddMemberToGroup(requestUserId, requestUserFullName) {
    Alert.alert(
      '',
      `Are your sure to add ${requestUserFullName} to the group ?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          style: 'destructive',
        },
        {
          text: 'Yes',
          onPress: () =>
            this.addMemberToGroup(requestUserId, requestUserFullName),
        },
      ],
      {cancelable: false},
    );
  }

  async addMemberToGroup(requestUserId, requestUserFullName) {
    let user = await GFun.user();
    let response = await Api.joinGroup(
      user.authentication_jwt,
      this.state.chatRoom.group.id,
      requestUserId,
    );

    if (response.success) {
      GFun.successMessage(
        I18n.t('message.success'),
        I18n.t('message.joinGroupSuccessful'),
      );
    } else {
      let errors = [];
      response.error.map((error, i) => {
        errors.splice(
          i,
          0,
          I18n.t(`message.${GFun.camelize(error)}`, {
            name: requestUserFullName,
          }),
        );
      });
      GFun.errorMessage(
        I18n.t('message.error', {
          name: requestUserFullName,
        }),
        errors.join('\n'),
      );
    }
  }

  loadEarlier() {
    return (
      <View style={{padding: 20}}>
        <ActivityIndicator size="small"></ActivityIndicator>
      </View>
    );
  }

  renderComposer = props => {
    return (
      <View
        style={{
          flexDirection: 'row',
          backgroundColor: this.state.isDarkMode ? '#202020' : '#FFF',
        }}>
        <View style={{flex: 1, padding: 3}}>
          <TextInput
            keyboardAppearance={this.state.isDarkMode ? 'dark' : 'light'}
            placeholder={props.placeholder}
            placeholderTextColor={'#A4A4A4'}
            onChangeText={text => {
              this.setState({
                text: text,
                isReadySend: text !== '',
              });
            }}
            style={{
              borderRadius: 22,
              padding: 10,
              backgroundColor: this.state.isDarkMode ? '#363636' : '#EAEAEA',
              height: 40,
              color: this.state.isDarkMode ? '#FFF' : '#000',
            }}
            value={this.state.text}
          />
        </View>
        <View
          style={{
            flex: 0.1,
            padding: 3,
            justifyContent: 'center',
            alignSelf: 'center',
          }}>
          <TouchableOpacity
            disabled={!this.state.isReadySend}
            onPress={() => {
              props.onSend({text: this.state.text.trim()}, true);
              this.setState({text: '', isReadySend: false});
            }}>
            <MatIcon
              name="send"
              style={{
                fontSize: 30,
                color: this.state.isReadySend
                  ? this.state.chatRoom.group.color
                  : '#D1D1D1',
              }}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  async onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages[0]),
    }));
    let resp = await Api.createChat(
      this.state.user.authentication_jwt,
      this.state.chatRoom.id,
      messages[0],
    );
    if (resp.success) {
      // this.setState(previousState => ({
      //   messages: GiftedChat.append(previousState.messages, resp.message),
      // }));
    }
  }

  isCloseToTop({layoutMeasurement, contentOffset, contentSize}) {
    let paddingToTop = 80;
    let isLoading =
      contentSize.height - layoutMeasurement.height - paddingToTop <=
      contentOffset.y;

    if (isLoading && this.state.chatRoom.is_loading_more) {
      this.setState({isLoading: isLoading});
      this.loadMoreMessage();
    }
  }

  async loadMoreMessage() {
    let params = {
      limit: this.state.limit,
      offset: this.state.messages.length,
    };
    let resp = await Api.getChatMessage(
      this.state.user.authentication_jwt,
      this.state.chatRoom.id,
      params,
    );
    if (resp.success) {
      await this.setState({
        messages: GFun.unique(this.state.messages.concat(resp.messages), '_id'),
        isLoading: false,
      });
    }
  }

  renderBubble = props => {
    return (
      <Bubble
        {...props}
        textStyle={{
          left: {
            color: this.state.isDarkMode ? '#FFF' : '#000',
          },
        }}
        wrapperStyle={{
          left: {
            backgroundColor: this.state.isDarkMode ? '#383838' : '#DADADA',
          },
          right: {
            backgroundColor: this.state.chatRoom.group.color || '#0084ff',
          },
        }}
      />
    );
  };

  renderQuickReplies = props => {
    return props.user._id === this.state.chatRoom.group_leader_id ? (
      <QuickReplies
        color={this.state.chatRoom.group.color || '#0084ff'}
        {...props}
      />
    ) : null;
  };

  onQuickReply(quickReplys) {
    quickReply = quickReplys[0];
    this.dialogAddMemberToGroup(
      quickReply.requestUserId,
      quickReply.requestUserFullName,
    );
  }

  render() {
    return (
      <View
        style={[
          styles.chatView,
          {
            backgroundColor: this.state.isDarkMode ? '#202020' : '#EEEEEE',
          },
        ]}>
        {this.AppHerder()}
        <View style={{flex: 1}}>
          {this.state.spinner ? (
            <Spinner
              visible={this.state.spinner}
              textContent={`${I18n.t('placeholder.loading')}...`}
              textStyle={styles.spinnerTextStyle}
            />
          ) : (
            <GiftedChat
              listViewProps={{
                scrollEventThrottle: 400,
                onScroll: ({nativeEvent}) => {
                  this.isCloseToTop(nativeEvent);
                },
              }}
              isAnimated
              loadEarlier={this.state.isLoading}
              text={this.state.text}
              renderLoadEarlier={this.loadEarlier}
              renderUsernameOnMessage
              renderComposer={this.renderComposer}
              textInputStyle={{fontFamily: 'Kanit-Light'}}
              messages={this.state.messages}
              onSend={messages => this.onSend(messages)}
              renderBubble={this.renderBubble}
              renderQuickReplies={this.renderQuickReplies}
              onQuickReply={quickReply => this.onQuickReply(quickReply)}
              user={{
                _id: this.state.user.id,
              }}
            />
          )}
        </View>
      </View>
    );
  }
}

import React, {Component} from 'react';
import {Alert, FlatList, Platform, StatusBar, View} from 'react-native';
import {Appbar, Text, Searchbar, TextInput} from 'react-native-paper';
import I18n from '../../components/i18n';
import {styles} from '../../components/styles';
import {ListItem, Icon} from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import Swipeout from 'react-native-swipeout';
import * as Api from '../../util/Api';
import * as GFunction from '../../util/GlobalFunction';
import {GiftedChat} from 'react-native-gifted-chat';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import Spinner from 'react-native-loading-spinner-overlay';
import firebase from 'react-native-firebase';
import {Composer} from 'react-native-gifted-chat';

const IS_IOS = Platform.OS === 'ios';
export default class ChatView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      user: [],
      spinner: false,
      chatRoom: this.props.navigation.state.params.chatRoom,
      messages: [],
      search: '',
      text: '',
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
          {this.state.chatRoom.is_request_join_group_leader ? (
            <Appbar.Action
              icon="plus-one"
              onPress={() => this.dialogAddMemberToGroup()}
            />
          ) : null}
        </Appbar.Header>
      </View>
    );
  }

  realTimeData(data) {
    if (data.noti_type === 'chat' || data.noti_type.includes('request_join-')) {
      let message = JSON.parse(data.message);
      if (this.state.user.id !== message.user._id) {
        let messageIndex = this.state.messages.findIndex(
          m => m.id === message.id,
        );

        if (messageIndex !== -1) {
          this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, message),
          }));
        }
      }
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

  async componentWillMount() {
    // get user
    let user = await GFunction.user();
    await this.setState({user: user});

    this.loadChat();
  }

  async loadChat() {
    await this.setState({
      messages: this.state.chatRoom.messages,
    });
    // let resp = await Api.getChatMessage(
    //   this.state.user.authentication_jwt,
    //   this.state.chatRoom.id,
    // );
    // if (resp.success) {
    //   await this.setState({
    //     messages: resp.messages,
    //     spinner: false,
    //   });
    // }
  }

  dialogAddMemberToGroup() {
    Alert.alert(
      '',
      `Are your sure ?`,
      [
        {
          text: 'Cancel',
          style: 'cancel',
          style: 'destructive',
        },
        {
          text: 'Yes',
          onPress: () => this.addMemberToGroup(),
        },
      ],
      {cancelable: false},
    );
  }

  async addMemberToGroup() {
    let user = await GFunction.user();
    let response = await Api.joinGroup(
      user.authentication_jwt,
      this.state.chatRoom.group.id,
      this.state.messages[0].user._id,
    );

    if (response.success) {
      GFunction.successMessage(
        I18n.t('message.success'),
        I18n.t('message.joinGroupSuccessful'),
      );
    } else {
      let errors = [];
      response.error.map((error, i) => {
        errors.splice(i, 0, I18n.t(`message.${GFunction.camelize(error)}`));
      });
      GFunction.errorMessage(I18n.t('message.error'), errors.join('\n'));
    }
  }

  async onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, resp.message),
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

  renderComposer = props => {
    console.log(props);
    return (
      <View style={{flexDirection: 'row'}}>
        <TextInput
          style={{paddingBottom: 6, fontFamily: 'Kanit-Light'}}
          label={I18n.t('placeholder.email')}
          mode="outlined"
        />
      </View>
    );
  };

  renderSend = props => {
    if (!props.text.trim()) {
      // text box empty
      return <Text>text box empty</Text>;
    }

    return <Text>SEND</Text>;
  };

  render() {
    return (
      <View style={styles.chatView}>
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
              text={this.state.text}
              alwaysShowSend={true}
              isAnimated
              loadEarlier
              onLoadEarlier={console.log('onLoadEarlier')}
              isLoadingEarlier={true}
              isTyping={true}
              textInputStyle={{fontFamily: 'Kanit-Light'}}
              messages={this.state.messages}
              onSend={messages => this.onSend(messages)}
              renderUsernameOnMessage
              renderActions={() => (
                <View>
                  <Text>dove</Text>
                </View>
              )}
              renderComposer={this.renderComposer}
              renderSend={this.renderSend}
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

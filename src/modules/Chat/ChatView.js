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

const IS_IOS = Platform.OS === 'ios';

export default class ChatView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      user: [],
      group: this.props.navigation.state.params.group,
      isRequestJoin: this.props.navigation.state.params.isRequestJoin,
      messages: [],
      search: '',
    };
  }

  AppHerder() {
    return (
      <View>
        <Appbar.Header
          style={{
            backgroundColor: this.state.group.color,
          }}>
          <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content title={this.state.group.name} />
          {this.state.isRequestJoin ? (
            <Appbar.Action
              icon="plus-one"
              onPress={() => this.dialogAddMemberToGroup()}
            />
          ) : null}
        </Appbar.Header>
      </View>
    );
  }

  async componentWillMount() {
    // get user
    let user = await GFunction.user();
    await this.setState({user: user});

    if (this.state.isRequestJoin) {
      this.loadChat();
      this.state.messages.push({
        _id: 5,
        text: `สวัสดีครับ ผม ${this.state.user.full_name} ต้องการเข้าร่วมกลุ่ม`,
        createdAt: new Date(),
        user: {
          _id: this.state.user.id,
          name: this.state.user.full_name,
        },
      });

      this.setState({messages: this.state.messages.reverse()});
    } else {
      this.loadChatGroup();
    }
  }

  loadChat() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: `สวัสดีครับ ผมเป็นหัวหน้ากลุ่ม ${this.state.group.name} โดยกลุ่มนี้จะหารบริการของ ${this.state.group.serviceName}`,
          createdAt: new Date(),
          user: {
            _id: 3,
            name: 'Saharak Manoo',
          },
        },
        {
          _id: 2,
          text: `กลุ่มนี้จะหารเดือนล่ะ ${this.state.group.service_charge} บาทครับ`,
          createdAt: new Date(),
          user: {
            _id: 3,
            name: 'Saharak Manoo',
          },
        },
        {
          _id: 3,
          text: `จ่ายทุกวันที่ 1 ของเดือน ที่พร้อมเพย์ 0123456789`,
          createdAt: new Date(),
          user: {
            _id: 3,
            name: 'Saharak Manoo',
          },
        },
        {
          _id: 4,
          text: `สงสัยอะไร สามารถพิมพ์ถามได้เลยน่ะครับ`,
          createdAt: new Date(),
          user: {
            _id: 3,
            name: 'Saharak Manoo',
          },
        },
      ],
    });
  }

  loadChatGroup() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'สวัสดีครับ ไม่ทราบว่าหารต่อเดือน เดือนล่ะเท่าไหร่หรอครับ',
          createdAt: new Date(),
          user: {
            _id: 3,
            name: 'Saharak Manoo',
          },
        },
        {
          _id: 2,
          text: `หารเดือนล่ะ ${this.state.group.service_charge} บาทครับ`,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Head Group',
          },
        },
        {
          _id: 3,
          text: `จ่ายทุกวันที่ 1 ของเดือน ที่พร้อมเพย์ 0123456789`,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Head Group',
          },
        },
      ],
    });
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
    GFunction.successMessage(
      I18n.t('message.success'),
      I18n.t('message.joinGroupSuccessful'),
    );
  }

  onSend(messages = []) {
    this.setState(previousState => ({
      messages: GiftedChat.append(previousState.messages, messages),
    }));
  }

  render() {
    return (
      <View style={styles.defaultView}>
        {this.AppHerder()}
        <View style={{flex: 1}}>
          <GiftedChat
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)}
            user={{
              _id: this.state.user.id,
            }}
          />
        </View>
      </View>
    );
  }
}

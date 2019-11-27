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

const IS_IOS = Platform.OS === 'ios';
const BAR_COLOR = IS_IOS ? '#09A650' : '#000';

export default class ChatView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      search: '',
    };
  }

  AppHerder() {
    return (
      <View>
        <Appbar.Header style={{backgroundColor: '#09A650'}}>
          <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content title={I18n.t('placeholder.chat')} />
        </Appbar.Header>
      </View>
    );
  }

  componentWillMount() {
    this.setState({
      messages: [
        {
          _id: 1,
          text: 'Hello developer',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
        {
          _id: 2,
          text: 'Hello Family Plan',
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'React Native',
            avatar: 'https://placeimg.com/140/140/any',
          },
        },
      ],
    });
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
            loadEarlier
            isLoadingEarlier
            messages={this.state.messages}
            onSend={messages => this.onSend(messages)}
          />
        </View>
      </View>
    );
  }
}

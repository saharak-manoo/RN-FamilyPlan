import React, {Component} from 'react';
import {Alert, FlatList, Platform, StatusBar, View} from 'react-native';
import {Appbar, Text, Searchbar} from 'react-native-paper';
import I18n from '../../components/i18n';
import {styles} from '../../components/styles';
import {Badge, ListItem, Icon} from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import Swipeout from 'react-native-swipeout';
import * as Api from '../../util/Api';
import * as GFunction from '../../util/GlobalFunction';
import Spinner from 'react-native-loading-spinner-overlay';

const IS_IOS = Platform.OS === 'ios';

export default class ChatListView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      spinner: false,
      search: '',
      groups: [],
    };
  }

  AppHerder() {
    return (
      <View>
        <Appbar.Header style={{backgroundColor: '#09A650'}}>
          <Appbar.Content title={I18n.t('placeholder.chat')} />
        </Appbar.Header>
      </View>
    );
  }

  componentWillMount = async () => {
    this.setState({spinner: true});
    let user = await GFunction.user();
    let resp = await Api.getGroup(user.authentication_token);
    if (resp.success) {
      this.setState({
        spinner: false,
        groups: resp.my_groups,
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
              style={{backgroundColor: '#FFF'}}>
              <ListItem
                key={index}
                Component={TouchableScale}
                friction={90}
                tension={100}
                activeScale={0.95}
                leftAvatar={{
                  source: {
                    uri:
                      'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
                  },
                }}
                title={item.name}
                onPress={() => this.goToChatRoom(item)}
                bottomDivider
                chevron={<Badge value={index + 10} status="error" />}
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
    this.state.groups.splice(index, 1);
    await this.setState({groups: this.state.groups});
    GFunction.successMessage(
      I18n.t('message.success'),
      I18n.t('message.removeChatSuccessful'),
    );
  }

  goToChatRoom(group) {
    this.props.navigation.navigate('ChatRoom', {
      group: group,
      isRequestJoin: false,
    });
  }

  render() {
    return (
      <View style={styles.defaultView}>
        {this.AppHerder()}
        <View style={{padding: 15}}>
          <Searchbar
            placeholder={I18n.t('placeholder.search')}
            onChangeText={searching => {
              this.setState({search: searching});
            }}
            value={this.state.search}
          />
        </View>
        {this.state.spinner ? (
          <Spinner
            visible={this.state.spinner}
            textContent={I18n.t('placeholder.loading') + '...'}
            textStyle={styles.spinnerTextStyle}
          />
        ) : (
          <View style={{flex: 1, padding: 15}}>
            {this.listChatRoom(this.state.groups)}
          </View>
        )}
      </View>
    );
  }
}

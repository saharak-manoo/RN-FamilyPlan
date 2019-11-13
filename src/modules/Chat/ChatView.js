import React, {Component} from 'react';
import {Alert, FlatList, StatusBar, View} from 'react-native';
import {Appbar, Text, Searchbar} from 'react-native-paper';
import I18n from '../../components/i18n';
import {styles} from '../../components/styles';
import {ListItem, Icon} from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import Swipeout from 'react-native-swipeout';
import * as Api from '../../util/Api';
import * as GFunction from '../../util/GlobalFunction';

const members = [
  {
    name: 'Amy Farha',
    avatar_url:
      'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'Vice President',
  },
  {
    name: 'Chris Jackson',
    avatar_url:
      'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'Vice Chairman',
  },
];

export default class ChatView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      search: '',
      members: members,
    };
  }

  AppHerder() {
    return (
      <View>
        <StatusBar backgroundColor="#09A650" barStyle="light-content" />
        <Appbar.Header style={{backgroundColor: '#09A650'}}>
          <Appbar.Content title={I18n.t('placeholder.chat')} />
        </Appbar.Header>
      </View>
    );
  }

  listMembers = members => {
    return (
      <FlatList
        style={{flex: 1}}
        data={members}
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
                leftAvatar={{source: {uri: item.avatar_url}}}
                title={item.name}
                subtitle={item.subtitle}
                bottomDivider
                chevron
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
          onPress: () => this.removeChatMember(id, index),
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
  }

  async removeChatMember(id, index) {
    this.state.members.splice(index, 1);
    await this.setState({group: this.state.members});
    GFunction.successMessage(
      I18n.t('message.success'),
      I18n.t('message.removeChatSuccessful'),
    );
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
        <View style={{flex: 1, padding: 15}}>{this.listMembers(members)}</View>
      </View>
    );
  }
}

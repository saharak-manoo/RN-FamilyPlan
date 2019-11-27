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

const IS_IOS = Platform.OS === 'ios';
const BAR_COLOR = IS_IOS ? '#F93636' : '#000';

const notifications = [
  {
    name: 'Amy Farha',
    photo_url:
      'https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg',
    subtitle: 'Vice President',
  },
  {
    name: 'Chris Jackson',
    photo_url:
      'https://s3.amazonaws.com/uifaces/faces/twitter/adhamdannaway/128.jpg',
    subtitle: 'Vice Chairman',
  },
];

export default class NotificationView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {};
  }

  AppHerder() {
    return (
      <View>
        <Appbar.Header style={{backgroundColor: '#F93636'}}>
          <Appbar.Content title={I18n.t('placeholder.notifications')} />
        </Appbar.Header>
      </View>
    );
  }

  listNotification = notifications => {
    return (
      <FlatList
        style={{flex: 1}}
        data={notifications}
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
                leftAvatar={{source: {uri: item.photo_url}}}
                title={item.name}
                subtitle={item.subtitle}
                bottomDivider
                containerStyle={{
                  backgroundColor: index == 0 ? '#D4FDE8' : '#FFF',
                }}
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
    GFunction.successMessage(
      I18n.t('message.success'),
      I18n.t('message.removeChatSuccessful'),
    );
  }

  render() {
    return (
      <View style={styles.defaultView}>
        {this.AppHerder()}
        <View style={{flex: 1}}>{this.listNotification(notifications)}</View>
      </View>
    );
  }
}

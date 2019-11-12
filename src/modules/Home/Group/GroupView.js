import React, {Component} from 'react';
import {Dimensions, FlatList, Modal, StatusBar, View} from 'react-native';
import {Appbar, Text} from 'react-native-paper';
import ActionButton from 'react-native-action-button';
import MatIcon from 'react-native-vector-icons/MaterialIcons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import I18n from '../../../components/i18n';
import {styles} from '../../../components/styles';
import Modalize from 'react-native-modalize';
import {ListItem, Icon} from 'react-native-elements';
import TouchableScale from 'react-native-touchable-scale';
import LinearGradient from 'react-native-linear-gradient';

// View
import InviteMemberView from '../../Modal/InviteMemberView';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

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

export default class GroupView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {};
    this.params = this.props.navigation.state.params;
  }

  inviteMemberModal = React.createRef();

  AppHerder() {
    return (
      <View>
        <StatusBar backgroundColor="#2370E6" barStyle="light-content" />
        <Appbar.Header style={{backgroundColor: '#2370E6'}}>
          <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content title={this.params.group.name} />
        </Appbar.Header>
      </View>
    );
  }

  showInviteMemberModal = () => {
    if (this.inviteMemberModal.current) {
      this.inviteMemberModal.current.open();
    }
  };

  popUpModalInviteMember() {
    return (
      <Modalize
        ref={this.inviteMemberModal}
        modalStyle={styles.popUpModal}
        overlayStyle={styles.overlayModal}
        handleStyle={styles.handleModal}
        modalHeight={height / 1.08}
        handlePosition="inside"
        openAnimationConfig={{
          timing: {duration: 400},
          spring: {speed: 10, bounciness: 10},
        }}
        closeAnimationConfig={{
          timing: {duration: 400},
          spring: {speed: 10, bounciness: 10},
        }}
        withReactModal
        adjustToContentHeight>
        <InviteMemberView modal={this.inviteMemberModal} />
      </Modalize>
    );
  }

  listInfo = () => {
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        <View style={{flex: 1, flexDirection: 'row', padding: 15}}>
          <Icon
            raised
            name="add-alert"
            type="mat-icon"
            color={this.params.group.color}
            onPress={() => console.log('hello')}
          />
          <Text
            style={{
              padding: 12,
              paddingLeft: 35,
              fontSize: 28,
              justifyContent: 'center',
            }}>
            12/09/2019
          </Text>
        </View>
        <View style={{flex: 1, flexDirection: 'row', padding: 15}}>
          <Icon
            raised
            name="dollar"
            type="font-awesome"
            color="#00C74E"
            onPress={() => console.log('hello')}
          />
          <Text
            style={{
              padding: 12,
              paddingLeft: 35,
              fontSize: 28,
              justifyContent: 'center',
            }}>
            105
          </Text>
        </View>
      </View>
    );
  };

  listMembers = members => {
    return (
      <FlatList
        style={{flex: 1}}
        data={members}
        renderItem={({item, index}) => {
          return (
            <ListItem
              key={index}
              containerStyle={{borderRadius: 15}}
              Component={TouchableScale}
              friction={90}
              tension={100}
              activeScale={0.95}
              leftAvatar={{source: {uri: item.avatar_url}}}
              title={item.name}
              subtitle={item.subtitle}
              bottomDivider
            />
          );
        }}
        keyExtractor={item => item}
      />
    );
  };

  render() {
    return (
      <View style={styles.defaultView}>
        {this.AppHerder()}
        <View style={{flex: 0.2, paddingLeft: 15, paddingTop: 22}}>
          <Text style={{fontSize: 38}}>Info</Text>
        </View>
        <View style={styles.cardListInfo}>{this.listInfo()}</View>

        <View style={{flex: 0.2, paddingLeft: 15, paddingTop: 22}}>
          <Text style={{fontSize: 38}}>Members</Text>
        </View>
        <View style={styles.cardListMember}>{this.listMembers(members)}</View>

        {this.popUpModalInviteMember()}
        <ActionButton buttonColor="rgba(231,76,60,1)">
          <ActionButton.Item
            buttonColor="#03C8A1"
            title={I18n.t('placeholder.inviteMember')}
            onPress={this.showInviteMemberModal}>
            <MatIcon name="group-add" style={styles.actionButtonIcon} />
          </ActionButton.Item>
          <ActionButton.Item
            buttonColor="#3D71FB"
            title={I18n.t('placeholder.setUpAReminder')}
            onPress={this.showSetUpAReminderModal}>
            <MatIcon name="add-alert" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
      </View>
    );
  }
}

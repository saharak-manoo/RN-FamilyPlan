import React, {Component} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Modal,
  StatusBar,
  View,
} from 'react-native';
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
import Swipeout from 'react-native-swipeout';
import * as GFunction from '../../../util/GlobalFunction';

// View
import InviteMemberView from '../../Modal/InviteMemberView';
import SetUpReminderView from '../../Modal/SetUpReminderView';
import SettingServiceChargeView from '../../Modal/SettingServiceChargeView';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;

export default class GroupView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      group: this.props.navigation.state.params.group,
    };
  }

  inviteMemberModal = React.createRef();
  setUpReminderModal = React.createRef();
  settingServiceChargeModal = React.createRef();

  async componentWillMount() {
    await this.setState({group: this.props.navigation.state.params.group});
  }

  AppHerder() {
    return (
      <View>
        <StatusBar backgroundColor="#2370E6" barStyle="light-content" />
        <Appbar.Header style={{backgroundColor: '#2370E6'}}>
          <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content title={this.state.group.name} />
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
        <InviteMemberView
          modal={this.inviteMemberModal}
          group={this.state.group}
          onSetNewData={this.setNewData}
        />
      </Modalize>
    );
  }

  showSetUpReminderModal = () => {
    if (this.setUpReminderModal.current) {
      this.setUpReminderModal.current.open();
    }
  };

  popUpModalSetUpReminder() {
    return (
      <Modalize
        ref={this.setUpReminderModal}
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
        <SetUpReminderView
          modal={this.setUpReminderModal}
          group={this.state.group}
          onSetNewData={this.setNewData}
        />
      </Modalize>
    );
  }

  showSettingServiceChargeModal = () => {
    if (this.settingServiceChargeModal.current) {
      this.settingServiceChargeModal.current.open();
    }
  };

  popUpModalSettingServiceCharge() {
    return (
      <Modalize
        ref={this.settingServiceChargeModal}
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
        <SettingServiceChargeView
          modal={this.settingServiceChargeModal}
          group={this.state.group}
          onSetNewData={this.setNewData}
        />
      </Modalize>
    );
  }

  setNewData = async group => {
    await this.setState({group: group});
  };

  listInfo = () => {
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        <View style={{flex: 1, flexDirection: 'row', padding: 15}}>
          <Icon
            raised
            name="add-alert"
            type="mat-icon"
            color={this.state.group.color}
            onPress={this.showSetUpReminderModal}
          />
          <Text
            style={{
              padding: 14,
              paddingLeft: 35,
              fontSize: 28,
              justifyContent: 'center',
            }}>
            {this.state.group.due_date}
          </Text>
        </View>
        <View style={{flex: 1, flexDirection: 'row', padding: 15}}>
          <Icon
            raised
            name="dollar"
            type="font-awesome"
            color="#00C74E"
            onPress={this.showSettingServiceChargeModal}
          />
          <Text
            style={{
              padding: 14,
              paddingLeft: 35,
              fontSize: 28,
              justifyContent: 'center',
            }}>
            {this.state.group.service_charge}
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
            <Swipeout
              autoClose={true}
              right={[
                {
                  text: 'Delete',
                  type: 'delete',
                  onPress: () => {
                    this.alertRemoveMember(item.id, index);
                  },
                },
              ]}
              style={{backgroundColor: '#FFF', borderRadius: 15}}>
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
            </Swipeout>
          );
        }}
        keyExtractor={item => item}
      />
    );
  };

  alertRemoveMember(id, index) {
    Alert.alert(
      '',
      'Are your sure tou want to delete this member ?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: () => this.removeMember(id, index),
          style: 'destructive',
        },
      ],
      {cancelable: false},
    );
  }

  async removeMember(id, index) {
    this.state.group.members.splice(index, 1);
    await this.setState({group: this.state.group});
    GFunction.successMessage(
      I18n.t('message.success'),
      I18n.t('message.removeMemberSuccessful'),
    );
  }

  render() {
    return (
      <View style={styles.defaultView}>
        {this.AppHerder()}
        <View style={{flex: 0.2, paddingLeft: 15, paddingTop: 22}}>
          <Text style={{fontSize: 38}}>{I18n.t('text.info')}</Text>
        </View>
        <View style={styles.cardListInfo}>{this.listInfo()}</View>

        <View style={{flex: 0.2, paddingLeft: 15, paddingTop: 22}}>
          <Text style={{fontSize: 38}}>{I18n.t('text.members')}</Text>
        </View>
        <View style={styles.cardListMember}>
          {this.listMembers(this.state.group.members)}
        </View>

        {this.popUpModalInviteMember()}
        {this.popUpModalSettingServiceCharge()}
        {this.popUpModalSetUpReminder()}
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
            onPress={this.showSetUpReminderModal}>
            <MatIcon name="add-alert" style={styles.actionButtonIcon} />
          </ActionButton.Item>
        </ActionButton>
      </View>
    );
  }
}

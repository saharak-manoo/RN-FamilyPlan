import React, {Component} from 'react';
import {
  Alert,
  Dimensions,
  FlatList,
  Platform,
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
import * as Api from '../../../util/Api';
import * as GFunction from '../../../util/GlobalFunction';
import ReactNativePickerModule from 'react-native-picker-module';

// View
import InviteMemberView from '../../Modal/InviteMemberView';
import SettingServiceChargeView from '../../Modal/SettingServiceChargeView';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const IS_IOS = Platform.OS === 'ios';

export default class GroupView extends Component<Props> {
  constructor(props) {
    super(props);
    this.state = {
      group: this.props.navigation.state.params.group,
      userView: [],
      selectedDay: null,
      day: '30',
      days: Array.from({length: 31}, (v, k) => k + 1).map(String),
    };
  }

  inviteMemberModal = React.createRef();
  settingServiceChargeModal = React.createRef();

  async componentWillMount() {
    let user = await GFunction.user();
    let userView = this.props.navigation.state.params.group.members.filter(
      m => m.id === user.id,
    )[0];
    await this.setState({
      group: this.props.navigation.state.params.group,
      userView: userView,
    });
  }

  AppHerder() {
    return (
      <View>
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

  popUpModalSetUpReminder() {
    return (
      <ReactNativePickerModule
        pickerRef={e => (this.pickerRef = e)}
        selectedValue={this.state.selectedDay}
        title={I18n.t('placeholder.setUpAReminder')}
        items={this.state.days}
        onValueChange={(day, index) => {
          this.setState({
            day: day,
            selectedDay: index,
          });
        }}
      />
    );
  }

  showSettingServiceChargeModal = () => {
    if (
      this.settingServiceChargeModal.current &&
      this.state.userView.group_leader
    ) {
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
        <View
          style={{flex: 1, flexDirection: 'row', padding: IS_IOS ? 15 : 10}}>
          <Icon
            raised
            name="add-alert"
            type="mat-icon"
            color={this.state.group.color}
            onPress={() => {
              this.pickerRef.show();
            }}
          />
          <Text
            style={{
              padding: IS_IOS ? 15 : 5,
              paddingLeft: 35,
              fontSize: 28,
              justifyContent: 'center',
            }}>
            {I18n.t('text.notiGroupPayment', {
              day: this.state.day,
            })}
          </Text>
        </View>
        <View
          style={{flex: 1, flexDirection: 'row', padding: IS_IOS ? 14 : 10}}>
          <Icon
            raised
            name="dollar"
            type="font-awesome"
            color="#00C74E"
            onPress={this.showSettingServiceChargeModal}
          />
          <Text
            style={{
              padding: IS_IOS ? 14 : 4,
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
          let yourSelf = this.state.userView.id === item.id;
          return !yourSelf && this.state.userView.group_leader ? (
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
                leftAvatar={{source: {uri: item.photo}}}
                title={item.full_name}
                subtitle={item.email}
                bottomDivider
                chevron={
                  item.group_leader ? (
                    <MatIcon
                      name="grade"
                      size={25}
                      style={{color: '#ECD703'}}
                    />
                  ) : null
                }
              />
            </Swipeout>
          ) : (
            <ListItem
              key={index}
              containerStyle={{borderRadius: 15}}
              Component={TouchableScale}
              friction={90}
              tension={100}
              activeScale={0.95}
              leftAvatar={{source: {uri: item.photo}}}
              title={item.full_name}
              subtitle={item.email}
              bottomDivider
              chevron={
                item.group_leader ? (
                  <MatIcon name="grade" size={25} style={{color: '#ECD703'}} />
                ) : null
              }
            />
          );
        }}
        keyExtractor={item => item}
      />
    );
  };

  alertRemoveMember(id, index) {
    Alert.alert(
      '',
      'Are your sure to want to delete this member ?',
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

  alertLeaveGroup(id, index) {
    Alert.alert(
      '',
      'Are your sure to want to leave this group ?',
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
    let user = await GFunction.user();

    let response = await Api.leaveGroup(
      user.authentication_jwt,
      this.state.group.id,
      id,
    );

    if (response.success) {
      this.state.group.members.splice(index, 1);
      await this.setState({group: this.state.group});
      if (id === user.id) {
        GFunction.successMessage(
          I18n.t('message.success'),
          I18n.t('message.leaveGroupSuccessful'),
        );
        this.props.navigation.state.params.onLeaveGroup();
        this.props.navigation.navigate('Home');
      } else {
        GFunction.successMessage(
          I18n.t('message.success'),
          I18n.t('message.removeMemberSuccessful'),
        );
      }
    } else {
      this.loadingJoinGroup.showLoading(false);
      let errors = [];
      response.error.map((error, i) => {
        errors.splice(i, 0, I18n.t(`message.${GFunction.camelize(error)}`));
      });
      GFunction.errorMessage(I18n.t('message.error'), errors.join('\n'));
    }
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

        {this.state.userView.group_leader ? (
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
              onPress={() => {
                this.pickerRef.show();
              }}>
              <MatIcon name="add-alert" style={styles.actionButtonIcon} />
            </ActionButton.Item>
          </ActionButton>
        ) : (
          <ActionButton
            icon={
              <MatIcon name="exit-to-app" style={styles.actionButtonIcon} />
            }
            buttonColor="rgba(231,76,60,1)"
            onPress={() =>
              this.alertLeaveGroup(
                this.state.userView.id,
                this.state.group.members.findIndex(
                  m => m.id === this.state.userView.id,
                ),
              )
            }
          />
        )}
      </View>
    );
  }
}

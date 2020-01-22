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
import {connect} from 'react-redux';
import {setDarkMode, setLanguage} from '../../actions';
import AsyncStorage from '@react-native-community/async-storage';
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
import * as Api from '../../actions/api';
import * as GFun from '../../../helpers/globalFunction';
import ReactNativePickerModule from 'react-native-picker-module';
import firebase from 'react-native-firebase';
import UserAvatar from 'react-native-user-avatar';
import * as Authenticate from '../../../helpers/authenticate';
import {scbEasyApi} from '../../../../app';

// View
import InviteMemberView from '../../modal/inviteMemberView';
import SettingServiceChargeView from '../../modal/settingServiceChargeView';
import UsernamePasswordGroupView from '../../modal/usernamePasswordGroupView';
import ScbPaymentView from '../../modal/scbPaymentView';
import ScbQRCodePaymentView from '../../modal/scbQRCodePaymentView';

const width = Dimensions.get('window').width;
const height = Dimensions.get('window').height;
const IS_IOS = Platform.OS === 'ios';

class GroupView extends Component {
  constructor(props) {
    super(props);
    let params = this.props.navigation.state.params;
    let group = params.group;
    this.state = {
      isDarkMode: this.props.setting.isDarkMode,
      group: group,
      userView: [],
      selectedDay: null,
      notiPayment: group.noti_payment,
      days: Array.from({length: 31}, (v, k) => k + 1).map(String),
    };
  }

  inviteMemberModal = React.createRef();
  settingServiceChargeModal = React.createRef();
  usernamePasswordModal = React.createRef();
  scbPaymentModal = React.createRef();
  scbQRCodePaymentModal = React.createRef();

  async componentWillMount() {
    this.triggerTurnOnNotification();
    let user = await GFun.user();
    let userView = this.props.navigation.state.params.group.members.filter(
      m => m.id === user.id,
    )[0];

    await this.setState({
      group: this.props.navigation.state.params.group,
      userView: userView,
    });
  }

  async triggerTurnOnNotification() {
    this.notificationListener = firebase
      .notifications()
      .onNotification(async notification => {
        this.realTimeData(notification._data);
      });
  }

  async realTimeData(data) {
    let user = await GFun.user();
    if (data.noti_type === 'group') {
      let group = JSON.parse(data.group);
      if (this.state.group.id === group.id) {
        let resp = await Api.getGroupById(user.authentication_jwt, group.id);
        if (resp.success) {
          this.setState({
            group: resp.group,
          });
        }
      }
    }
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

  AppHerder() {
    return (
      <View>
        <Appbar.Header style={{backgroundColor: this.props.setting.appColor}}>
          <Appbar.BackAction onPress={() => this.props.navigation.goBack()} />
          <Appbar.Content
            title={this.state.group.name}
            titleStyle={{fontFamily: 'Kanit-Light'}}
          />
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
          isDarkMode={this.state.isDarkMode}
          group={this.state.group}
          onSetNewData={this.setNewData}
        />
      </Modalize>
    );
  }

  showModalSetUpReminder = () => {
    if (this.state.userView.group_leader) {
      this.pickerRef.show();
    }
  };

  popUpModalSetUpReminder() {
    return (
      <ReactNativePickerModule
        pickerRef={e => (this.pickerRef = e)}
        selectedValue={this.state.selectedDay}
        title={I18n.t('placeholder.setUpAReminder')}
        items={this.state.days}
        confirmButton={I18n.t('button.save')}
        cancelButton={I18n.t('button.cancel')}
        onValueChange={(day, index) => {
          this.state.group.noti_payment = day.toString();
          this.setState({
            notiPayment: day,
            selectedDay: index,
            group: this.state.group,
          });
          this.updateNotiPayment();
        }}
      />
    );
  }

  async updateNotiPayment() {
    let user = await GFun.user();
    let params = {
      noti_payment: parseInt(this.state.notiPayment),
    };

    let response = await Api.updateGroup(
      user.authentication_jwt,
      this.state.group.id,
      params,
    );

    if (response.success) {
      this.setState({group: response.group});
      GFun.successMessage(
        I18n.t('message.success'),
        I18n.t('message.settingDueDateSuccessful'),
      );
    } else {
      let errors = [];
      response.error.map((error, i) => {
        errors.splice(i, 0, I18n.t(`message.${GFun.camelize(error)}`));
      });
      GFun.errorMessage(I18n.t('message.notValidate'), errors.join('\n'));
    }
  }

  showSettingServiceChargeModal = async () => {
    if (
      this.settingServiceChargeModal.current &&
      this.state.userView.group_leader
    ) {
      this.settingServiceChargeModal.current.open();
    } else if (this.scbPaymentModal.current && scbEasyApi) {
      let {isPassed, error} = await Authenticate.open(
        I18n.t('message.requestToOpenUsernamePasswordGroup', {
          name: this.state.group.name,
        }),
      );
      if (isPassed) {
        this.scbPaymentModal.current.open();
      } else {
        GFun.errorMessage(
          I18n.t('message.error'),
          I18n.t('message.authenticateFailed'),
        );
      }
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
          isDarkMode={this.state.isDarkMode}
          group={this.state.group}
          onSetNewData={this.setNewData}
        />
      </Modalize>
    );
  }

  setNewData = async group => {
    await this.setState({group: group});
  };

  showModalUsernamePassword = async () => {
    if (this.usernamePasswordModal.current) {
      let {isPassed, error} = await Authenticate.open(
        I18n.t('message.requestToOpenUsernamePasswordGroup', {
          name: this.state.group.name,
        }),
      );
      if (isPassed) {
        this.usernamePasswordModal.current.open();
      } else {
        GFun.errorMessage(
          I18n.t('message.error'),
          I18n.t('message.authenticateFailed'),
        );
      }
    }
  };

  popUpModalUsernamePassword() {
    return (
      <Modalize
        ref={this.usernamePasswordModal}
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
        <UsernamePasswordGroupView
          modal={this.usernamePasswordModal}
          isDarkMode={this.state.isDarkMode}
          isGroupLeader={this.state.userView.group_leader}
          group={this.state.group}
          onSetNewData={this.setNewData}
        />
      </Modalize>
    );
  }

  showModalSCBPayment = async () => {
    if (this.scbPaymentModal.current && scbEasyApi) {
      let {isPassed, error} = await Authenticate.open(
        I18n.t('message.requestToOpenUsernamePasswordGroup', {
          name: this.state.group.name,
        }),
      );
      if (isPassed) {
        this.scbPaymentModal.current.open();
      } else {
        GFun.errorMessage(
          I18n.t('message.error'),
          I18n.t('message.authenticateFailed'),
        );
      }
    }
  };

  popUpModalSCBPayment() {
    return (
      <Modalize
        ref={this.scbPaymentModal}
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
        <ScbPaymentView
          modal={this.scbPaymentModal}
          isDarkMode={this.state.isDarkMode}
          group={this.state.group}
          onNoAppSCBEasy={this.noAppSCBEasy}
          onPaymentDone={this.paymentDone}
        />
      </Modalize>
    );
  }

  noAppSCBEasy() {}

  showModalSCBQRCodePayment = async () => {
    if (this.scbQRCodePaymentModal.current && scbEasyApi) {
      let {isPassed, error} = await Authenticate.open(
        I18n.t('message.requestToOpenUsernamePasswordGroup', {
          name: this.state.group.name,
        }),
      );
      if (isPassed) {
        this.scbQRCodePaymentModal.current.open();
      } else {
        GFun.errorMessage(
          I18n.t('message.error'),
          I18n.t('message.authenticateFailed'),
        );
      }
    }
  };

  popUpModalSCBQRCodePayment() {
    return (
      <Modalize
        ref={this.scbQRCodePaymentModal}
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
        <ScbQRCodePaymentView
          modal={this.scbQRCodePaymentModal}
          isDarkMode={this.state.isDarkMode}
          group={this.state.group}
        />
      </Modalize>
    );
  }

  paymentDone() {
    console.log('payment Done.......');
  }

  listInfo = () => {
    return (
      <View style={{flex: 1, flexDirection: 'column'}}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            padding: IS_IOS ? 13 : 10,
            fontFamily: 'Kanit-Light',
          }}>
          <Icon
            size={height / 40}
            raised
            name="add-alert"
            type="mat-icon"
            color={this.state.group.color}
            onPress={this.showModalSetUpReminder}
          />
          <Text
            style={{
              padding: IS_IOS ? 13 : 5,
              paddingLeft: GFun.wp(8),
              fontSize: GFun.hp(3),
              justifyContent: 'center',
              fontFamily: 'Kanit-Light',
            }}>
            {I18n.t('text.notiGroupPayment', {
              day: this.state.group.noti_payment,
            })}
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            padding: IS_IOS ? 14 : 10,
          }}>
          <Icon
            size={height / 40}
            raised
            name="dollar"
            type="font-awesome"
            color="#00C74E"
            onPress={this.showSettingServiceChargeModal}
          />
          <Text
            style={{
              padding: IS_IOS ? 14 : 4,
              paddingLeft: GFun.wp(8),
              fontSize: GFun.hp(3),
              justifyContent: 'center',
              fontFamily: 'Kanit-Light',
            }}>
            {parseFloat(
              this.state.group.service_charge / this.state.group.members.length,
            ).toFixed(2)}
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
              style={{
                backgroundColor: this.state.isDarkMode ? '#363636' : '#FFF',
                borderRadius: 15,
                fontFamily: 'Kanit-Light',
              }}>
              <ListItem
                key={index}
                containerStyle={{
                  borderRadius: 15,
                  backgroundColor: this.state.isDarkMode ? '#363636' : '#FFF',
                }}
                Component={TouchableScale}
                friction={90}
                tension={100}
                activeScale={0.95}
                leftAvatar={() => (
                  <UserAvatar
                    size="40"
                    name={item.full_name}
                    src={item.photo}
                  />
                )}
                title={item.full_name}
                titleStyle={{
                  fontFamily: 'Kanit-Light',
                  color: this.state.isDarkMode ? '#FFF' : '#000',
                }}
                subtitle={item.email}
                subtitleStyle={{
                  fontFamily: 'Kanit-Light',
                  color: this.state.isDarkMode ? '#FFF' : '#000',
                }}
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
              containerStyle={{
                borderRadius: 15,
                backgroundColor: this.state.isDarkMode ? '#363636' : '#FFF',
              }}
              Component={TouchableScale}
              friction={90}
              tension={100}
              activeScale={0.95}
              leftAvatar={() => (
                <UserAvatar size="40" name={item.full_name} src={item.photo} />
              )}
              title={item.full_name}
              titleStyle={{
                fontFamily: 'Kanit-Light',
                color: this.state.isDarkMode ? '#FFF' : '#000',
              }}
              subtitle={item.email}
              subtitleStyle={{
                fontFamily: 'Kanit-Light',
                color: this.state.isDarkMode ? '#FFF' : '#000',
              }}
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
    let user = await GFun.user();

    let response = await Api.leaveGroup(
      user.authentication_jwt,
      this.state.group.id,
      id,
    );

    if (response.success) {
      this.state.group.members.splice(index, 1);
      await this.setState({group: this.state.group});
      if (id === user.id) {
        GFun.successMessage(
          I18n.t('message.success'),
          I18n.t('message.leaveGroupSuccessful'),
        );
        this.props.navigation.state.params.onLeaveGroup();
        this.props.navigation.navigate('Home', {
          isDarkMode: this.state.isDarkMode,
        });
      } else {
        GFun.successMessage(
          I18n.t('message.success'),
          I18n.t('message.removeMemberSuccessful'),
        );
      }
    } else {
      this.loadingJoinGroup.showLoading(false);
      let errors = [];
      response.error.map((error, i) => {
        errors.splice(i, 0, I18n.t(`message.${GFun.camelize(error)}`));
      });
      GFun.errorMessage(I18n.t('message.error'), errors.join('\n'));
    }
  }

  goToChatRoom(chatRoom) {
    this.props.navigation.navigate('ChatRoom', {
      chatRoom: chatRoom,
      isRequestJoin: false,
    });
  }

  render() {
    return (
      <View
        style={{
          fontFamily: 'Kanit-Light',
          flex: 1,
          backgroundColor: this.state.isDarkMode ? '#202020' : '#EEEEEE',
        }}>
        {this.AppHerder()}
        <View style={{flex: 0.2, paddingLeft: 15, paddingTop: 22}}>
          <Text style={{fontSize: 34, fontFamily: 'Kanit-Light'}}>
            {this.state.group.service_name}
          </Text>
        </View>
        <View
          style={{
            fontFamily: 'Kanit-Light',
            flex: 0.6,
            margin: 10,
            backgroundColor: this.state.isDarkMode ? '#363636' : '#FFF',
            borderRadius: 15,
          }}>
          {this.listInfo()}
        </View>

        <View style={{flex: 0.2, paddingLeft: 15, paddingTop: 22}}>
          <Text style={{fontSize: 34, fontFamily: 'Kanit-Light'}}>
            {I18n.t('text.members')}
          </Text>
        </View>
        <View
          style={{
            fontFamily: 'Kanit-Light',
            flex: 1,
            margin: 10,
            backgroundColor: this.state.isDarkMode ? '#363636' : '#FFF',
            borderRadius: 15,
          }}>
          {this.listMembers(this.state.group.members)}
        </View>

        {this.popUpModalInviteMember()}
        {this.popUpModalSettingServiceCharge()}
        {this.popUpModalSetUpReminder()}
        {this.popUpModalUsernamePassword()}
        {this.popUpModalSCBPayment()}
        {this.popUpModalSCBQRCodePayment()}

        {this.state.userView.group_leader ? (
          <ActionButton
            buttonColor="rgba(231,76,60,1)"
            icon={<FAIcon name="cog" style={styles.actionButtonIcon} />}>
            {scbEasyApi && (
              <ActionButton.Item
                buttonColor="#000"
                title={I18n.t('placeholder.qrcodePayment')}
                textStyle={{fontFamily: 'Kanit-Light'}}
                onPress={this.showModalSCBQRCodePayment}>
                <FAIcon name="qrcode" style={styles.actionButtonIcon} />
              </ActionButton.Item>
            )}
            <ActionButton.Item
              buttonColor="#6D06F9"
              title={I18n.t('placeholder.chat')}
              textStyle={{fontFamily: 'Kanit-Light'}}
              onPress={() => this.goToChatRoom(this.state.group.chat_room)}>
              <MatIcon name="chat" style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item
              buttonColor="#03C8A1"
              title={I18n.t('placeholder.inviteMember')}
              textStyle={{fontFamily: 'Kanit-Light'}}
              onPress={this.showInviteMemberModal}>
              <MatIcon name="group-add" style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item
              buttonColor="#3D71FB"
              title={I18n.t('placeholder.setUpAReminder')}
              textStyle={{fontFamily: 'Kanit-Light'}}
              onPress={this.showModalSetUpReminder}>
              <MatIcon name="add-alert" style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item
              buttonColor="#ED5D00"
              title={I18n.t('placeholder.usernameAndPassword')}
              textStyle={{fontFamily: 'Kanit-Light'}}
              onPress={this.showModalUsernamePassword}>
              <MatIcon name="https" style={styles.actionButtonIcon} />
            </ActionButton.Item>
          </ActionButton>
        ) : (
          <ActionButton buttonColor="#FE8536">
            {scbEasyApi && (
              <ActionButton.Item
                buttonColor="#000"
                title={I18n.t('placeholder.qrcodePayment')}
                textStyle={{fontFamily: 'Kanit-Light'}}
                onPress={this.showModalSCBQRCodePayment}>
                <FAIcon name="qrcode" style={styles.actionButtonIcon} />
              </ActionButton.Item>
            )}
            <ActionButton.Item
              buttonColor="#3D71FB"
              title={I18n.t('placeholder.chat')}
              textStyle={{fontFamily: 'Kanit-Light'}}
              onPress={() => this.goToChatRoom(this.state.group.chat_room)}>
              <MatIcon name="chat" style={styles.actionButtonIcon} />
            </ActionButton.Item>
            <ActionButton.Item
              buttonColor="#ED5D00"
              title={I18n.t('placeholder.usernameAndPassword')}
              textStyle={{fontFamily: 'Kanit-Light'}}
              onPress={this.showModalUsernamePassword}>
              <MatIcon name="https" style={styles.actionButtonIcon} />
            </ActionButton.Item>
            {scbEasyApi && (
              <ActionButton.Item
                buttonColor="#6161FF"
                title={I18n.t('placeholder.payment')}
                textStyle={{fontFamily: 'Kanit-Light'}}
                onPress={this.showModalSCBPayment}>
                <MatIcon name="attach-money" style={styles.actionButtonIcon} />
              </ActionButton.Item>
            )}
            <ActionButton.Item
              buttonColor="rgba(231,76,60,1)"
              title={I18n.t('placeholder.leaveGroup')}
              textStyle={{fontFamily: 'Kanit-Light'}}
              onPress={() =>
                this.alertLeaveGroup(
                  this.state.userView.id,
                  this.state.group.members.findIndex(
                    m => m.id === this.state.userView.id,
                  ),
                )
              }>
              <MatIcon name="exit-to-app" style={styles.actionButtonIcon} />
            </ActionButton.Item>
          </ActionButton>
        )}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  screenBadge: state.screenBadge,
  setting: state.setting,
});

const mapDispatchToProps = {
  setDarkMode,
  setLanguage,
};

export default connect(mapStateToProps, mapDispatchToProps)(GroupView);
